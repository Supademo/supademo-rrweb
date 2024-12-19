(function (g, f) {if ("object" == typeof exports && "object" == typeof module) {module.exports = f();} else if ("function" == typeof define && define.amd) {define("rrwebPluginSequentialIdReplay", [], f);} else if ("object" == typeof exports) {exports["rrwebPluginSequentialIdReplay"] = f();} else {g["rrwebPluginSequentialIdReplay"] = f();}}(typeof self !== 'undefined' ? self : typeof globalThis !== 'undefined' ? globalThis : this, () => {var exports = {};var module = { exports };
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s={key:"_sid",warnOnMissingId:!0},u=n=>{const{key:e,warnOnMissingId:a}=n?Object.assign({},s,n):s;let i=1;return{handler(t){if(e in t){const l=t[e];l!==i?console.error(`[sequential-id-plugin]: expect to get an id with value "${i}", but got "${l}"`):i++}else a&&console.warn(`[sequential-id-plugin]: failed to get id in key: "${e}"`)}}};exports.getReplaySequentialIdPlugin=u;
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
//# sourceMappingURL=rrweb-plugin-sequential-id-replay.umd.min.cjs.map
