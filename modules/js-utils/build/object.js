"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = exports.invert = void 0;
function invert(object) {
    const out = {};
    Object.entries(object).forEach(([key, value]) => (out['' + value] = key));
    return out;
}
exports.invert = invert;
function pick(source, ...keys) {
    const returnValue = {};
    keys.forEach((k) => {
        returnValue[k] = source[k];
    });
    return returnValue;
}
exports.pick = pick;
