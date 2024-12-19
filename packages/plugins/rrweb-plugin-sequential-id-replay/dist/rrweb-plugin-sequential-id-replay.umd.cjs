(function (g, f) {if ("object" == typeof exports && "object" == typeof module) {module.exports = f();} else if ("function" == typeof define && define.amd) {define("rrwebPluginSequentialIdReplay", [], f);} else if ("object" == typeof exports) {exports["rrwebPluginSequentialIdReplay"] = f();} else {g["rrwebPluginSequentialIdReplay"] = f();}}(typeof self !== 'undefined' ? self : typeof globalThis !== 'undefined' ? globalThis : this, () => {var exports = {};var module = { exports };
"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const defaultOptions = {
  key: "_sid",
  warnOnMissingId: true
};
const getReplaySequentialIdPlugin = (options) => {
  const { key, warnOnMissingId } = options ? Object.assign({}, defaultOptions, options) : defaultOptions;
  let currentId = 1;
  return {
    handler(event) {
      if (key in event) {
        const id = event[key];
        if (id !== currentId) {
          console.error(
            `[sequential-id-plugin]: expect to get an id with value "${currentId}", but got "${id}"`
          );
        } else {
          currentId++;
        }
      } else if (warnOnMissingId) {
        console.warn(
          `[sequential-id-plugin]: failed to get id in key: "${key}"`
        );
      }
    }
  };
};
exports.getReplaySequentialIdPlugin = getReplaySequentialIdPlugin;
;if (typeof module.exports == "object" && typeof exports == "object") {
  var __cp = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of Object.getOwnPropertyNames(from)) {
        if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except)
        Object.defineProperty(to, key, {
          get: () => from[key],
          enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable,
        });
      }
    }
    return to;
  };
  module.exports = __cp(module.exports, exports);
}
return module.exports;
}))
//# sourceMappingURL=rrweb-plugin-sequential-id-replay.umd.cjs.map
