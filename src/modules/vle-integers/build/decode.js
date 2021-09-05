"use strict";
/* eslint no-bitwise: "off", no-magic-numbers: "off", complexity: "off", max-statements: "off" */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeVLEAtOffset = void 0;
function getByte(byteArray, offset, isString) {
    const byte = byteArray[offset] || 0;
    return isString ? byte.charCodeAt(0) : byte;
}
function decodeVLEAtOffset(bytes, offset = 0) {
    const isString = typeof bytes === 'string';
    let byte = getByte(bytes, offset, isString);
    const isNegative = byte & 64;
    let firstByte = true;
    let offsetCtr = 0;
    let number = 0;
    while (true) {
        if (offsetCtr === 5) {
            throw new RangeError('vle-integers attempting to decode data outside of valid range');
        }
        const bits = firstByte ? 6 : 7;
        const continueFlag = byte & 128;
        const byteVal = byte & ((1 << bits) - 1);
        firstByte = false;
        number += byteVal << (offsetCtr ? 6 + 7 * (offsetCtr - 1) : 0);
        offsetCtr++;
        if (continueFlag) {
            byte = getByte(bytes, offset + offsetCtr, isString);
        }
        else {
            break;
        }
    }
    return {
        number: isNegative ? -number : number,
        offset: offset + offsetCtr,
    };
}
exports.decodeVLEAtOffset = decodeVLEAtOffset;
function decodeVLE(bytes) {
    const decoded = decodeVLEAtOffset(bytes);
    if (decoded.offset !== bytes.length) {
        throw new Error('vle-integers only decoded partial data.  If this is intended use decodeVLEAtOffset instead');
    }
    return decoded.number;
}
exports.default = decodeVLE;
