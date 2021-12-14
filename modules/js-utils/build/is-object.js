"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(obj) {
    // @ts-expect-error
    return !!obj && obj.constructor === Object;
}
exports.default = isObject;
