"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function throwBadSwitchValue(val) {
    throw new Error(`Unexpected switch value: ${val}`);
}
exports.default = throwBadSwitchValue;
