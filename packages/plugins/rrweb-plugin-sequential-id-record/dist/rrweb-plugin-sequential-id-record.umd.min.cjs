(function (g, f) {if ("object" == typeof exports && "object" == typeof module) {module.exports = f();} else if ("function" == typeof define && define.amd) {define("rrwebPluginSequentialIdRecord", [], f);} else if ("object" == typeof exports) {exports["rrwebPluginSequentialIdRecord"] = f();} else {g["rrwebPluginSequentialIdRecord"] = f();}}(typeof self !== 'undefined' ? self : typeof globalThis !== 'undefined' ? globalThis : this, () => {var exports = {};var module = { exports };
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s={key:"_sid"},i="rrweb/sequential-id@1",r=e=>{const t=e?Object.assign({},s,e):s;let o=0;return{name:i,eventProcessor(n){return Object.assign(n,{[t.key]:++o}),n},options:t}};exports.PLUGIN_NAME=i;exports.getRecordSequentialIdPlugin=r;
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
//# sourceMappingURL=rrweb-plugin-sequential-id-record.umd.min.cjs.map
