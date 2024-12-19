"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
/*! simple-peer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
const MAX_BUFFERED_AMOUNT = 64 * 1024;
const ICECOMPLETE_TIMEOUT = 5 * 1e3;
const CHANNEL_CLOSING_TIMEOUT = 5 * 1e3;
function randombytes(size) {
  const array = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = Math.random() * 256 | 0;
  }
  return array;
}
function getBrowserRTC() {
  if (typeof globalThis === "undefined") return null;
  const wrtc = {
    RTCPeerConnection: globalThis.RTCPeerConnection || globalThis.mozRTCPeerConnection || globalThis.webkitRTCPeerConnection,
    RTCSessionDescription: globalThis.RTCSessionDescription || globalThis.mozRTCSessionDescription || globalThis.webkitRTCSessionDescription,
    RTCIceCandidate: globalThis.RTCIceCandidate || globalThis.mozRTCIceCandidate || globalThis.webkitRTCIceCandidate
  };
  if (!wrtc.RTCPeerConnection) return null;
  return wrtc;
}
function errCode(err, code) {
  Object.defineProperty(err, "code", {
    value: code,
    enumerable: true,
    configurable: true
  });
  return err;
}
function filterTrickle(sdp) {
  return sdp.replace(/a=ice-options:trickle\s\n/g, "");
}
function warn(message) {
  console.warn(message);
}
class Peer {
  constructor(opts = {}) {
    this._map = /* @__PURE__ */ new Map();
    this._id = randombytes(4).toString("hex").slice(0, 7);
    this._doDebug = opts.debug;
    this._debug("new peer %o", opts);
    this.channelName = opts.initiator ? opts.channelName || randombytes(20).toString("hex") : null;
    this.initiator = opts.initiator || false;
    this.channelConfig = opts.channelConfig || Peer.channelConfig;
    this.channelNegotiated = this.channelConfig.negotiated;
    this.config = Object.assign({}, Peer.config, opts.config);
    this.offerOptions = opts.offerOptions || {};
    this.answerOptions = opts.answerOptions || {};
    this.sdpTransform = opts.sdpTransform || ((sdp) => sdp);
    this.streams = opts.streams || (opts.stream ? [opts.stream] : []);
    this.trickle = opts.trickle !== void 0 ? opts.trickle : true;
    this.allowHalfTrickle = opts.allowHalfTrickle !== void 0 ? opts.allowHalfTrickle : false;
    this.iceCompleteTimeout = opts.iceCompleteTimeout || ICECOMPLETE_TIMEOUT;
    this.destroyed = false;
    this.destroying = false;
    this._connected = false;
    this.remoteAddress = void 0;
    this.remoteFamily = void 0;
    this.remotePort = void 0;
    this.localAddress = void 0;
    this.localFamily = void 0;
    this.localPort = void 0;
    this._wrtc = opts.wrtc && typeof opts.wrtc === "object" ? opts.wrtc : getBrowserRTC();
    if (!this._wrtc) {
      if (typeof window === "undefined") {
        throw errCode(
          new Error(
            "No WebRTC support: Specify `opts.wrtc` option in this environment"
          ),
          "ERR_WEBRTC_SUPPORT"
        );
      } else {
        throw errCode(
          new Error("No WebRTC support: Not a supported browser"),
          "ERR_WEBRTC_SUPPORT"
        );
      }
    }
    this._pcReady = false;
    this._channelReady = false;
    this._iceComplete = false;
    this._iceCompleteTimer = null;
    this._channel = null;
    this._pendingCandidates = [];
    this._isNegotiating = false;
    this._firstNegotiation = true;
    this._batchedNegotiation = false;
    this._queuedNegotiation = false;
    this._sendersAwaitingStable = [];
    this._senderMap = /* @__PURE__ */ new Map();
    this._closingInterval = null;
    this._remoteTracks = [];
    this._remoteStreams = [];
    this._chunk = null;
    this._cb = null;
    this._interval = null;
    try {
      this._pc = new this._wrtc.RTCPeerConnection(this.config);
    } catch (err) {
      this.destroy(errCode(err, "ERR_PC_CONSTRUCTOR"));
      return;
    }
    this._isReactNativeWebrtc = typeof this._pc._peerConnectionId === "number";
    this._pc.oniceconnectionstatechange = () => {
      this._onIceStateChange();
    };
    this._pc.onicegatheringstatechange = () => {
      this._onIceStateChange();
    };
    this._pc.onconnectionstatechange = () => {
      this._onConnectionStateChange();
    };
    this._pc.onsignalingstatechange = () => {
      this._onSignalingStateChange();
    };
    this._pc.onicecandidate = (event) => {
      this._onIceCandidate(event);
    };
    if (typeof this._pc.peerIdentity === "object") {
      this._pc.peerIdentity.catch((err) => {
        this.destroy(errCode(err, "ERR_PC_PEER_IDENTITY"));
      });
    }
    if (this.initiator || this.channelNegotiated) {
      this._setupData({
        channel: this._pc.createDataChannel(
          this.channelName,
          this.channelConfig
        )
      });
    } else {
      this._pc.ondatachannel = (event) => {
        this._setupData(event);
      };
    }
    if (this.streams) {
      this.streams.forEach((stream) => {
        this.addStream(stream);
      });
    }
    this._pc.ontrack = (event) => {
      this._onTrack(event);
    };
    this._debug("initial negotiation");
    this._needsNegotiation();
  }
  get bufferSize() {
    return this._channel && this._channel.bufferedAmount || 0;
  }
  // HACK: it's possible channel.readyState is "closing" before peer.destroy() fires
  // https://bugs.chromium.org/p/chromium/issues/detail?id=882743
  get connected() {
    return this._connected && this._channel.readyState === "open";
  }
  address() {
    return {
      port: this.localPort,
      family: this.localFamily,
      address: this.localAddress
    };
  }
  signal(data) {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot signal after peer is destroyed"), "ERR_DESTROYED");
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        data = {};
      }
    }
    this._debug("signal()");
    if (data.renegotiate && this.initiator) {
      this._debug("got request to renegotiate");
      this._needsNegotiation();
    }
    if (data.transceiverRequest && this.initiator) {
      this._debug("got request for transceiver");
      this.addTransceiver(
        data.transceiverRequest.kind,
        data.transceiverRequest.init
      );
    }
    if (data.candidate) {
      if (this._pc.remoteDescription && this._pc.remoteDescription.type) {
        this._addIceCandidate(data.candidate);
      } else {
        this._pendingCandidates.push(data.candidate);
      }
    }
    if (data.sdp) {
      this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(data)).then(() => {
        if (this.destroyed) return;
        this._pendingCandidates.forEach((candidate) => {
          this._addIceCandidate(candidate);
        });
        this._pendingCandidates = [];
        if (this._pc.remoteDescription.type === "offer") this._createAnswer();
      }).catch((err) => {
        this.destroy(errCode(err, "ERR_SET_REMOTE_DESCRIPTION"));
      });
    }
    if (!data.sdp && !data.candidate && !data.renegotiate && !data.transceiverRequest) {
      this.destroy(
        errCode(
          new Error("signal() called with invalid signal data"),
          "ERR_SIGNALING"
        )
      );
    }
  }
  _addIceCandidate(candidate) {
    const iceCandidateObj = new this._wrtc.RTCIceCandidate(candidate);
    this._pc.addIceCandidate(iceCandidateObj).catch((err) => {
      if (!iceCandidateObj.address || iceCandidateObj.address.endsWith(".local")) {
        warn("Ignoring unsupported ICE candidate.");
      } else {
        this.destroy(errCode(err, "ERR_ADD_ICE_CANDIDATE"));
      }
    });
  }
  /**
   * Send text/binary data to the remote peer.
   * @param {ArrayBufferView|ArrayBuffer|string|Blob} chunk
   */
  send(chunk) {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot send after peer is destroyed"), "ERR_DESTROYED");
    this._channel.send(chunk);
  }
  /**
   * Add a Transceiver to the connection.
   * @param {String} kind
   * @param {Object} init
   */
  addTransceiver(kind, init) {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot addTransceiver after peer is destroyed"), "ERR_DESTROYED");
    this._debug("addTransceiver()");
    if (this.initiator) {
      try {
        this._pc.addTransceiver(kind, init);
        this._needsNegotiation();
      } catch (err) {
        this.destroy(errCode(err, "ERR_ADD_TRANSCEIVER"));
      }
    } else {
      this.emit("signal", {
        // request initiator to renegotiate
        type: "transceiverRequest",
        transceiverRequest: { kind, init }
      });
    }
  }
  /**
   * Add a MediaStream to the connection.
   * @param {MediaStream} stream
   */
  addStream(stream) {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot addStream after peer is destroyed"), "ERR_DESTROYED");
    this._debug("addStream()");
    stream.getTracks().forEach((track) => {
      this.addTrack(track, stream);
    });
  }
  /**
   * Add a MediaStreamTrack to the connection.
   * @param {MediaStreamTrack} track
   * @param {MediaStream} stream
   */
  addTrack(track, stream) {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot addTrack after peer is destroyed"), "ERR_DESTROYED");
    this._debug("addTrack()");
    const submap = this._senderMap.get(track) || /* @__PURE__ */ new Map();
    let sender = submap.get(stream);
    if (!sender) {
      sender = this._pc.addTrack(track, stream);
      submap.set(stream, sender);
      this._senderMap.set(track, submap);
      this._needsNegotiation();
    } else if (sender.removed) {
      throw errCode(
        new Error(
          "Track has been removed. You should enable/disable tracks that you want to re-add."
        ),
        "ERR_SENDER_REMOVED"
      );
    } else {
      throw errCode(
        new Error("Track has already been added to that stream."),
        "ERR_SENDER_ALREADY_ADDED"
      );
    }
  }
  /**
   * Replace a MediaStreamTrack by another in the connection.
   * @param {MediaStreamTrack} oldTrack
   * @param {MediaStreamTrack} newTrack
   * @param {MediaStream} stream
   */
  replaceTrack(oldTrack, newTrack, stream) {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot replaceTrack after peer is destroyed"), "ERR_DESTROYED");
    this._debug("replaceTrack()");
    const submap = this._senderMap.get(oldTrack);
    const sender = submap ? submap.get(stream) : null;
    if (!sender) {
      throw errCode(
        new Error("Cannot replace track that was never added."),
        "ERR_TRACK_NOT_ADDED"
      );
    }
    if (newTrack) this._senderMap.set(newTrack, submap);
    if (sender.replaceTrack != null) {
      sender.replaceTrack(newTrack);
    } else {
      this.destroy(
        errCode(
          new Error("replaceTrack is not supported in this browser"),
          "ERR_UNSUPPORTED_REPLACETRACK"
        )
      );
    }
  }
  /**
   * Remove a MediaStreamTrack from the connection.
   * @param {MediaStreamTrack} track
   * @param {MediaStream} stream
   */
  removeTrack(track, stream) {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot removeTrack after peer is destroyed"), "ERR_DESTROYED");
    this._debug("removeSender()");
    const submap = this._senderMap.get(track);
    const sender = submap ? submap.get(stream) : null;
    if (!sender) {
      throw errCode(
        new Error("Cannot remove track that was never added."),
        "ERR_TRACK_NOT_ADDED"
      );
    }
    try {
      sender.removed = true;
      this._pc.removeTrack(sender);
    } catch (err) {
      if (err.name === "NS_ERROR_UNEXPECTED") {
        this._sendersAwaitingStable.push(sender);
      } else {
        this.destroy(errCode(err, "ERR_REMOVE_TRACK"));
      }
    }
    this._needsNegotiation();
  }
  /**
   * Remove a MediaStream from the connection.
   * @param {MediaStream} stream
   */
  removeStream(stream) {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot removeStream after peer is destroyed"), "ERR_DESTROYED");
    this._debug("removeSenders()");
    stream.getTracks().forEach((track) => {
      this.removeTrack(track, stream);
    });
  }
  _needsNegotiation() {
    this._debug("_needsNegotiation");
    if (this._batchedNegotiation) return;
    this._batchedNegotiation = true;
    queueMicrotask(() => {
      this._batchedNegotiation = false;
      if (this.initiator || !this._firstNegotiation) {
        this._debug("starting batched negotiation");
        this.negotiate();
      } else {
        this._debug("non-initiator initial negotiation request discarded");
      }
      this._firstNegotiation = false;
    });
  }
  negotiate() {
    if (this.destroying) return;
    if (this.destroyed) throw errCode(new Error("cannot negotiate after peer is destroyed"), "ERR_DESTROYED");
    if (this.initiator) {
      if (this._isNegotiating) {
        this._queuedNegotiation = true;
        this._debug("already negotiating, queueing");
      } else {
        this._debug("start negotiation");
        setTimeout(() => {
          this._createOffer();
        }, 0);
      }
    } else {
      if (this._isNegotiating) {
        this._queuedNegotiation = true;
        this._debug("already negotiating, queueing");
      } else {
        this._debug("requesting negotiation from initiator");
        this.emit("signal", {
          // request initiator to renegotiate
          type: "renegotiate",
          renegotiate: true
        });
      }
    }
    this._isNegotiating = true;
  }
  destroy(err) {
    if (this.destroyed || this.destroying) return;
    this.destroying = true;
    this._debug("destroying (error: %s)", err && (err.message || err));
    queueMicrotask(() => {
      this.destroyed = true;
      this.destroying = false;
      this._debug("destroy (error: %s)", err && (err.message || err));
      this._connected = false;
      this._pcReady = false;
      this._channelReady = false;
      this._remoteTracks = null;
      this._remoteStreams = null;
      this._senderMap = null;
      clearInterval(this._closingInterval);
      this._closingInterval = null;
      clearInterval(this._interval);
      this._interval = null;
      this._chunk = null;
      this._cb = null;
      if (this._channel) {
        try {
          this._channel.close();
        } catch (err2) {
        }
        this._channel.onmessage = null;
        this._channel.onopen = null;
        this._channel.onclose = null;
        this._channel.onerror = null;
      }
      if (this._pc) {
        try {
          this._pc.close();
        } catch (err2) {
        }
        this._pc.oniceconnectionstatechange = null;
        this._pc.onicegatheringstatechange = null;
        this._pc.onsignalingstatechange = null;
        this._pc.onicecandidate = null;
        this._pc.ontrack = null;
        this._pc.ondatachannel = null;
      }
      this._pc = null;
      this._channel = null;
      if (err) this.emit("error", err);
      this.emit("close");
    });
  }
  _setupData(event) {
    if (!event.channel) {
      return this.destroy(
        errCode(
          new Error("Data channel event is missing `channel` property"),
          "ERR_DATA_CHANNEL"
        )
      );
    }
    this._channel = event.channel;
    this._channel.binaryType = "arraybuffer";
    if (typeof this._channel.bufferedAmountLowThreshold === "number") {
      this._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT;
    }
    this.channelName = this._channel.label;
    this._channel.onmessage = (event2) => {
      this._onChannelMessage(event2);
    };
    this._channel.onbufferedamountlow = () => {
      this._onChannelBufferedAmountLow();
    };
    this._channel.onopen = () => {
      this._onChannelOpen();
    };
    this._channel.onclose = () => {
      this._onChannelClose();
    };
    this._channel.onerror = (err) => {
      this.destroy(errCode(err, "ERR_DATA_CHANNEL"));
    };
    let isClosing = false;
    this._closingInterval = setInterval(() => {
      if (this._channel && this._channel.readyState === "closing") {
        if (isClosing) this._onChannelClose();
        isClosing = true;
      } else {
        isClosing = false;
      }
    }, CHANNEL_CLOSING_TIMEOUT);
  }
  _startIceCompleteTimeout() {
    if (this.destroyed) return;
    if (this._iceCompleteTimer) return;
    this._debug("started iceComplete timeout");
    this._iceCompleteTimer = setTimeout(() => {
      if (!this._iceComplete) {
        this._iceComplete = true;
        this._debug("iceComplete timeout completed");
        this.emit("iceTimeout");
        this.emit("_iceComplete");
      }
    }, this.iceCompleteTimeout);
  }
  _createOffer() {
    if (this.destroyed) return;
    this._pc.createOffer(this.offerOptions).then((offer) => {
      if (this.destroyed) return;
      if (!this.trickle && !this.allowHalfTrickle) {
        offer.sdp = filterTrickle(offer.sdp);
      }
      offer.sdp = this.sdpTransform(offer.sdp);
      const sendOffer = () => {
        if (this.destroyed) return;
        const signal = this._pc.localDescription || offer;
        this._debug("signal");
        this.emit("signal", {
          type: signal.type,
          sdp: signal.sdp
        });
      };
      const onSuccess = () => {
        this._debug("createOffer success");
        if (this.destroyed) return;
        if (this.trickle || this._iceComplete) sendOffer();
        else this.once("_iceComplete", sendOffer);
      };
      const onError = (err) => {
        this.destroy(errCode(err, "ERR_SET_LOCAL_DESCRIPTION"));
      };
      this._pc.setLocalDescription(offer).then(onSuccess).catch(onError);
    }).catch((err) => {
      this.destroy(errCode(err, "ERR_CREATE_OFFER"));
    });
  }
  _requestMissingTransceivers() {
    if (this._pc.getTransceivers) {
      this._pc.getTransceivers().forEach((transceiver) => {
        if (!transceiver.mid && transceiver.sender.track && !transceiver.requested) {
          transceiver.requested = true;
          this.addTransceiver(transceiver.sender.track.kind);
        }
      });
    }
  }
  _createAnswer() {
    if (this.destroyed) return;
    this._pc.createAnswer(this.answerOptions).then((answer) => {
      if (this.destroyed) return;
      if (!this.trickle && !this.allowHalfTrickle) {
        answer.sdp = filterTrickle(answer.sdp);
      }
      answer.sdp = this.sdpTransform(answer.sdp);
      const sendAnswer = () => {
        if (this.destroyed) return;
        const signal = this._pc.localDescription || answer;
        this._debug("signal");
        this.emit("signal", {
          type: signal.type,
          sdp: signal.sdp
        });
        if (!this.initiator) this._requestMissingTransceivers();
      };
      const onSuccess = () => {
        if (this.destroyed) return;
        if (this.trickle || this._iceComplete) sendAnswer();
        else this.once("_iceComplete", sendAnswer);
      };
      const onError = (err) => {
        this.destroy(errCode(err, "ERR_SET_LOCAL_DESCRIPTION"));
      };
      this._pc.setLocalDescription(answer).then(onSuccess).catch(onError);
    }).catch((err) => {
      this.destroy(errCode(err, "ERR_CREATE_ANSWER"));
    });
  }
  _onConnectionStateChange() {
    if (this.destroyed) return;
    if (this._pc.connectionState === "failed") {
      this.destroy(
        errCode(new Error("Connection failed."), "ERR_CONNECTION_FAILURE")
      );
    }
  }
  _onIceStateChange() {
    if (this.destroyed) return;
    const iceConnectionState = this._pc.iceConnectionState;
    const iceGatheringState = this._pc.iceGatheringState;
    this._debug(
      "iceStateChange (connection: %s) (gathering: %s)",
      iceConnectionState,
      iceGatheringState
    );
    this.emit("iceStateChange", iceConnectionState, iceGatheringState);
    if (iceConnectionState === "connected" || iceConnectionState === "completed") {
      this._pcReady = true;
      this._maybeReady();
    }
    if (iceConnectionState === "failed") {
      this.destroy(
        errCode(
          new Error("Ice connection failed."),
          "ERR_ICE_CONNECTION_FAILURE"
        )
      );
    }
    if (iceConnectionState === "closed") {
      this.destroy(
        errCode(
          new Error("Ice connection closed."),
          "ERR_ICE_CONNECTION_CLOSED"
        )
      );
    }
  }
  getStats(cb) {
    const flattenValues = (report) => {
      if (Object.prototype.toString.call(report.values) === "[object Array]") {
        report.values.forEach((value) => {
          Object.assign(report, value);
        });
      }
      return report;
    };
    if (this._pc.getStats.length === 0 || this._isReactNativeWebrtc) {
      this._pc.getStats().then(
        (res) => {
          const reports = [];
          res.forEach((report) => {
            reports.push(flattenValues(report));
          });
          cb(null, reports);
        },
        (err) => cb(err)
      );
    } else if (this._pc.getStats.length > 0) {
      this._pc.getStats(
        (res) => {
          if (this.destroyed) return;
          const reports = [];
          res.result().forEach((result) => {
            const report = {};
            result.names().forEach((name) => {
              report[name] = result.stat(name);
            });
            report.id = result.id;
            report.type = result.type;
            report.timestamp = result.timestamp;
            reports.push(flattenValues(report));
          });
          cb(null, reports);
        },
        (err) => cb(err)
      );
    } else {
      cb(null, []);
    }
  }
  _maybeReady() {
    this._debug(
      "maybeReady pc %s channel %s",
      this._pcReady,
      this._channelReady
    );
    if (this._connected || this._connecting || !this._pcReady || !this._channelReady) {
      return;
    }
    this._connecting = true;
    const findCandidatePair = () => {
      if (this.destroyed) return;
      this.getStats((err, items) => {
        if (this.destroyed) return;
        if (err) items = [];
        const remoteCandidates = {};
        const localCandidates = {};
        const candidatePairs = {};
        let foundSelectedCandidatePair = false;
        items.forEach((item) => {
          if (item.type === "remotecandidate" || item.type === "remote-candidate") {
            remoteCandidates[item.id] = item;
          }
          if (item.type === "localcandidate" || item.type === "local-candidate") {
            localCandidates[item.id] = item;
          }
          if (item.type === "candidatepair" || item.type === "candidate-pair") {
            candidatePairs[item.id] = item;
          }
        });
        const setSelectedCandidatePair = (selectedCandidatePair) => {
          foundSelectedCandidatePair = true;
          let local = localCandidates[selectedCandidatePair.localCandidateId];
          if (local && (local.ip || local.address)) {
            this.localAddress = local.ip || local.address;
            this.localPort = Number(local.port);
          } else if (local && local.ipAddress) {
            this.localAddress = local.ipAddress;
            this.localPort = Number(local.portNumber);
          } else if (typeof selectedCandidatePair.googLocalAddress === "string") {
            local = selectedCandidatePair.googLocalAddress.split(":");
            this.localAddress = local[0];
            this.localPort = Number(local[1]);
          }
          if (this.localAddress) {
            this.localFamily = this.localAddress.includes(":") ? "IPv6" : "IPv4";
          }
          let remote = remoteCandidates[selectedCandidatePair.remoteCandidateId];
          if (remote && (remote.ip || remote.address)) {
            this.remoteAddress = remote.ip || remote.address;
            this.remotePort = Number(remote.port);
          } else if (remote && remote.ipAddress) {
            this.remoteAddress = remote.ipAddress;
            this.remotePort = Number(remote.portNumber);
          } else if (typeof selectedCandidatePair.googRemoteAddress === "string") {
            remote = selectedCandidatePair.googRemoteAddress.split(":");
            this.remoteAddress = remote[0];
            this.remotePort = Number(remote[1]);
          }
          if (this.remoteAddress) {
            this.remoteFamily = this.remoteAddress.includes(":") ? "IPv6" : "IPv4";
          }
          this._debug(
            "connect local: %s:%s remote: %s:%s",
            this.localAddress,
            this.localPort,
            this.remoteAddress,
            this.remotePort
          );
        };
        items.forEach((item) => {
          if (item.type === "transport" && item.selectedCandidatePairId) {
            setSelectedCandidatePair(
              candidatePairs[item.selectedCandidatePairId]
            );
          }
          if (item.type === "googCandidatePair" && item.googActiveConnection === "true" || (item.type === "candidatepair" || item.type === "candidate-pair") && item.selected) {
            setSelectedCandidatePair(item);
          }
        });
        if (!foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)) {
          setTimeout(findCandidatePair, 100);
          return;
        } else {
          this._connecting = false;
          this._connected = true;
        }
        if (this._chunk) {
          try {
            this.send(this._chunk);
          } catch (err2) {
            return this.destroy(errCode(err2, "ERR_DATA_CHANNEL"));
          }
          this._chunk = null;
          this._debug('sent chunk from "write before connect"');
          const cb = this._cb;
          this._cb = null;
          cb(null);
        }
        if (typeof this._channel.bufferedAmountLowThreshold !== "number") {
          this._interval = setInterval(() => this._onInterval(), 150);
          if (this._interval.unref) this._interval.unref();
        }
        this._debug("connect");
        this.emit("connect");
      });
    };
    findCandidatePair();
  }
  _onInterval() {
    if (!this._cb || !this._channel || this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
      return;
    }
    this._onChannelBufferedAmountLow();
  }
  _onSignalingStateChange() {
    if (this.destroyed) return;
    if (this._pc.signalingState === "stable") {
      this._isNegotiating = false;
      this._debug("flushing sender queue", this._sendersAwaitingStable);
      this._sendersAwaitingStable.forEach((sender) => {
        this._pc.removeTrack(sender);
        this._queuedNegotiation = true;
      });
      this._sendersAwaitingStable = [];
      if (this._queuedNegotiation) {
        this._debug("flushing negotiation queue");
        this._queuedNegotiation = false;
        this._needsNegotiation();
      } else {
        this._debug("negotiated");
        this.emit("negotiated");
      }
    }
    this._debug("signalingStateChange %s", this._pc.signalingState);
    this.emit("signalingStateChange", this._pc.signalingState);
  }
  _onIceCandidate(event) {
    if (this.destroyed) return;
    if (event.candidate && this.trickle) {
      this.emit("signal", {
        type: "candidate",
        candidate: {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid
        }
      });
    } else if (!event.candidate && !this._iceComplete) {
      this._iceComplete = true;
      this.emit("_iceComplete");
    }
    if (event.candidate) {
      this._startIceCompleteTimeout();
    }
  }
  _onChannelMessage(event) {
    if (this.destroyed) return;
    let data = event.data;
    if (data instanceof ArrayBuffer) data = new Uint8Array(data);
    this.emit("data", data);
  }
  _onChannelBufferedAmountLow() {
    if (this.destroyed || !this._cb) return;
    this._debug(
      "ending backpressure: bufferedAmount %d",
      this._channel.bufferedAmount
    );
    const cb = this._cb;
    this._cb = null;
    cb(null);
  }
  _onChannelOpen() {
    if (this._connected || this.destroyed) return;
    this._debug("on channel open");
    this._channelReady = true;
    this._maybeReady();
  }
  _onChannelClose() {
    if (this.destroyed) return;
    this._debug("on channel close");
    this.destroy();
  }
  _onTrack(event) {
    if (this.destroyed) return;
    event.streams.forEach((eventStream) => {
      this._debug("on track");
      this.emit("track", event.track, eventStream);
      this._remoteTracks.push({
        track: event.track,
        stream: eventStream
      });
      if (this._remoteStreams.some((remoteStream) => {
        return remoteStream.id === eventStream.id;
      })) {
        return;
      }
      this._remoteStreams.push(eventStream);
      queueMicrotask(() => {
        this._debug("on stream");
        this.emit("stream", eventStream);
      });
    });
  }
  _debug(...args) {
    if (!this._doDebug) return;
    args[0] = "[" + this._id + "] " + args[0];
    console.log(...args);
  }
  // event emitter
  on(key, listener) {
    const map = this._map;
    if (!map.has(key)) map.set(key, /* @__PURE__ */ new Set());
    map.get(key).add(listener);
  }
  off(key, listener) {
    const map = this._map;
    const listeners = map.get(key);
    if (!listeners) return;
    listeners.delete(listener);
    if (listeners.size === 0) map.delete(key);
  }
  once(key, listener) {
    const listener_ = (...args) => {
      this.off(key, listener_);
      listener(...args);
    };
    this.on(key, listener_);
  }
  emit(key, ...args) {
    const map = this._map;
    if (!map.has(key)) return;
    for (const listener of map.get(key)) {
      try {
        listener(...args);
      } catch (err) {
        console.error(err);
      }
    }
  }
}
Peer.WEBRTC_SUPPORT = !!getBrowserRTC();
Peer.config = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478"
      ]
    }
  ],
  sdpSemantics: "unified-plan"
};
Peer.channelConfig = {};
const PLUGIN_NAME = "rrweb/canvas-webrtc@1";
class RRWebPluginCanvasWebRTCRecord {
  constructor({
    signalSendCallback,
    peer
  }) {
    __publicField(this, "peer", null);
    __publicField(this, "mirror");
    __publicField(this, "crossOriginIframeMirror");
    __publicField(this, "streamMap", /* @__PURE__ */ new Map());
    __publicField(this, "incomingStreams", /* @__PURE__ */ new Set());
    __publicField(this, "outgoingStreams", /* @__PURE__ */ new Set());
    __publicField(this, "streamNodeMap", /* @__PURE__ */ new Map());
    __publicField(this, "canvasWindowMap", /* @__PURE__ */ new Map());
    __publicField(this, "windowPeerMap", /* @__PURE__ */ new WeakMap());
    __publicField(this, "peerWindowMap", /* @__PURE__ */ new WeakMap());
    __publicField(this, "signalSendCallback");
    this.signalSendCallback = signalSendCallback;
    window.addEventListener(
      "message",
      (event) => this.windowPostMessageHandler(event)
    );
    if (peer) this.peer = peer;
  }
  initPlugin() {
    return {
      name: PLUGIN_NAME,
      getMirror: ({ nodeMirror, crossOriginIframeMirror }) => {
        this.mirror = nodeMirror;
        this.crossOriginIframeMirror = crossOriginIframeMirror;
      },
      options: {}
    };
  }
  signalReceive(signal) {
    var _a;
    if (!this.peer) this.setupPeer();
    (_a = this.peer) == null ? void 0 : _a.signal(signal);
  }
  signalReceiveFromCrossOriginIframe(signal, source) {
    const peer = this.setupPeer(source);
    peer.signal(signal);
  }
  startStream(id, stream) {
    var _a, _b;
    if (!this.peer) this.setupPeer();
    const data = {
      nodeId: id,
      streamId: stream.id
    };
    (_a = this.peer) == null ? void 0 : _a.send(JSON.stringify(data));
    if (!this.outgoingStreams.has(stream)) (_b = this.peer) == null ? void 0 : _b.addStream(stream);
    this.outgoingStreams.add(stream);
  }
  setupPeer(source) {
    let peer;
    if (!source) {
      if (this.peer) return this.peer;
      peer = this.peer = new Peer({
        initiator: true
        // trickle: false, // only create one WebRTC offer per session
      });
    } else {
      const peerFromMap = this.windowPeerMap.get(source);
      if (peerFromMap) return peerFromMap;
      peer = new Peer({
        initiator: false
        // trickle: false, // only create one WebRTC offer per session
      });
      this.windowPeerMap.set(source, peer);
      this.peerWindowMap.set(peer, source);
    }
    const resetPeer = (source2) => {
      if (!source2) return this.peer = null;
      this.windowPeerMap.delete(source2);
      this.peerWindowMap.delete(peer);
    };
    peer.on("error", (err) => {
      resetPeer(source);
      console.log("error", err);
    });
    peer.on("close", () => {
      resetPeer(source);
      console.log("closing");
    });
    peer.on("signal", (data) => {
      var _a, _b;
      if (this.inRootFrame()) {
        if (peer === this.peer) {
          this.signalSendCallback(data);
        } else {
          (_a = this.peerWindowMap.get(peer)) == null ? void 0 : _a.postMessage(
            {
              type: "rrweb-canvas-webrtc",
              data: {
                type: "signal",
                signal: data
              }
            },
            "*"
          );
        }
      } else {
        (_b = window.top) == null ? void 0 : _b.postMessage(
          {
            type: "rrweb-canvas-webrtc",
            data: {
              type: "signal",
              signal: data
            }
          },
          "*"
        );
      }
    });
    peer.on("connect", () => {
      if (this.inRootFrame() && peer !== this.peer) return;
      for (const [id, stream] of this.streamMap) {
        this.startStream(id, stream);
      }
    });
    if (!this.inRootFrame()) return peer;
    peer.on("data", (data) => {
      try {
        const json = JSON.parse(data);
        this.streamNodeMap.set(json.streamId, json.nodeId);
      } catch (error) {
        console.error("Could not parse data", error);
      }
      this.flushStreams();
    });
    peer.on("stream", (stream) => {
      this.incomingStreams.add(stream);
      this.flushStreams();
    });
    return peer;
  }
  setupStream(id, rootId) {
    var _a;
    if (id === -1 || !this.mirror) return false;
    let stream = this.streamMap.get(rootId || id);
    if (stream) return stream;
    const el = this.mirror.getNode(id);
    if (!el || !("captureStream" in el))
      return this.setupStreamInCrossOriginIframe(id, rootId || id);
    if (!this.inRootFrame()) {
      (_a = window.top) == null ? void 0 : _a.postMessage(
        {
          type: "rrweb-canvas-webrtc",
          data: {
            type: "i-have-canvas",
            rootId: rootId || id
          }
        },
        "*"
      );
    }
    stream = el.captureStream();
    this.streamMap.set(rootId || id, stream);
    this.setupPeer();
    return stream;
  }
  flushStreams() {
    this.incomingStreams.forEach((stream) => {
      const nodeId = this.streamNodeMap.get(stream.id);
      if (!nodeId) return;
      this.startStream(nodeId, stream);
    });
  }
  inRootFrame() {
    return Boolean(window.top && window.top === window);
  }
  setupStreamInCrossOriginIframe(id, rootId) {
    let found = false;
    document.querySelectorAll("iframe").forEach((iframe) => {
      var _a;
      if (found) return;
      if (!this.crossOriginIframeMirror) return;
      const remoteId = this.crossOriginIframeMirror.getRemoteId(iframe, id);
      if (remoteId === -1) return;
      found = true;
      (_a = iframe.contentWindow) == null ? void 0 : _a.postMessage(
        {
          type: "rrweb-canvas-webrtc",
          data: {
            type: "who-has-canvas",
            id: remoteId,
            rootId
          }
        },
        "*"
      );
    });
    return found;
  }
  isCrossOriginIframeMessageEventContent(event) {
    return Boolean(
      event.data && typeof event.data === "object" && "type" in event.data && "data" in event.data && event.data.type === "rrweb-canvas-webrtc" && event.data.data
    );
  }
  /**
   * All messages being sent to the (root or sub) frame are received through `windowPostMessageHandler`.
   * @param event - The message event
   */
  windowPostMessageHandler(event) {
    if (!this.isCrossOriginIframeMessageEventContent(event)) return;
    const { type } = event.data.data;
    if (type === "who-has-canvas") {
      const { id, rootId } = event.data.data;
      this.setupStream(id, rootId);
    } else if (type === "signal") {
      const { signal } = event.data.data;
      const { source } = event;
      if (!source || !("self" in source)) return;
      if (this.inRootFrame()) {
        this.signalReceiveFromCrossOriginIframe(signal, source);
      } else {
        this.signalReceive(signal);
      }
    } else if (type === "i-have-canvas") {
      const { rootId } = event.data.data;
      const { source } = event;
      if (!source || !("self" in source)) return;
      this.canvasWindowMap.set(rootId, source);
    }
  }
}
exports.PLUGIN_NAME = PLUGIN_NAME;
exports.RRWebPluginCanvasWebRTCRecord = RRWebPluginCanvasWebRTCRecord;
//# sourceMappingURL=rrweb-plugin-canvas-webrtc-record.cjs.map
