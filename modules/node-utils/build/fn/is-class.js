"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/ban-types -- The entire point is that this accepts any function!
function isClass(f) {
    return /^class /.test(f.toString());
}
exports.default = isClass;
