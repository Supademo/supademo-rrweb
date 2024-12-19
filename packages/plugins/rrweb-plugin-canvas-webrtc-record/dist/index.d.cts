import { default as default_2 } from 'simple-peer-light';
import { RecordPlugin } from '@supademo/rrweb-types';

export declare type CrossOriginIframeMessageEventContent = {
    type: 'rrweb-canvas-webrtc';
    data: {
        type: 'signal';
        signal: RTCSessionDescriptionInit;
    } | {
        type: 'who-has-canvas';
        rootId: number;
        id: number;
    } | {
        type: 'i-have-canvas';
        rootId: number;
    };
};

export declare const PLUGIN_NAME = "rrweb/canvas-webrtc@1";

export declare class RRWebPluginCanvasWebRTCRecord {
    private peer;
    private mirror;
    private crossOriginIframeMirror;
    private streamMap;
    private incomingStreams;
    private outgoingStreams;
    private streamNodeMap;
    private canvasWindowMap;
    private windowPeerMap;
    private peerWindowMap;
    private signalSendCallback;
    constructor({ signalSendCallback, peer, }: {
        signalSendCallback: RRWebPluginCanvasWebRTCRecord['signalSendCallback'];
        peer?: default_2.Instance;
    });
    initPlugin(): RecordPlugin;
    signalReceive(signal: RTCSessionDescriptionInit): void;
    signalReceiveFromCrossOriginIframe(signal: RTCSessionDescriptionInit, source: WindowProxy): void;
    private startStream;
    setupPeer(source?: WindowProxy): default_2.Instance;
    setupStream(id: number, rootId?: number): boolean | MediaStream;
    private flushStreams;
    private inRootFrame;
    setupStreamInCrossOriginIframe(id: number, rootId: number): boolean;
    private isCrossOriginIframeMessageEventContent;
    private windowPostMessageHandler;
}

export { }
