(function (g, f) {if ("object" == typeof exports && "object" == typeof module) {module.exports = f();} else if ("function" == typeof define && define.amd) {define("rrwebPluginSequentialIdRecord", [], f);} else if ("object" == typeof exports) {exports["rrwebPluginSequentialIdRecord"] = f();} else {g["rrwebPluginSequentialIdRecord"] = f();}}(typeof self !== 'undefined' ? self : typeof globalThis !== 'undefined' ? globalThis : this, () => {var exports = {};var module = { exports };
"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const defaultOptions = {
  key: "_sid"
};
const PLUGIN_NAME = "rrweb/sequential-id@1";
const getRecordSequentialIdPlugin = (options) => {
  const _options = options ? Object.assign({}, defaultOptions, options) : defaultOptions;
  let id = 0;
  return {
    name: PLUGIN_NAME,
    eventProcessor(event) {
      Object.assign(event, {
        [_options.key]: ++id
      });
      return event;
    },
    options: _options
  };
};
exports.PLUGIN_NAME = PLUGIN_NAME;
exports.getRecordSequentialIdPlugin = getRecordSequentialIdPlugin;
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
//# sourceMappingURL=rrweb-plugin-sequential-id-record.umd.cjs.map
