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
//# sourceMappingURL=rrweb-plugin-sequential-id-record.cjs.map
