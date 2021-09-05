"use strict";
/* eslint no-bitwise: "off", no-magic-numbers: "off", no-param-reassign: "off", complexity: "off", max-statements: "off" */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeToString = exports.encodeToBytes = void 0;
const MAX_NUMBER = Math.pow(2, 31);
exports.default = encodeToBytes;
function encodeToBytes(number) {
    if (Math.abs(number) >= MAX_NUMBER) {
        throw new RangeError('vle-integers can not currently encode a number with an absolute value larger than 2^31 - 1');
    }
    const bytes = [];
    const isNegative = number < 0;
    let byte;
    let firstByte = true;
    if (isNegative) {
        number = -number;
    }
    if (number === 0) {
        return [0];
    }
    while (number > 0) {
        if (firstByte) {
            byte = number & 63;
            if (isNegative) {
                byte |= 64;
            }
            number >>= 6;
            firstByte = false;
        }
        else {
            byte = number & 127;
            number >>= 7;
        }
        if (number) {
            byte |= 128;
        }
        bytes.push(byte);
    }
    return bytes;
}
exports.encodeToBytes = encodeToBytes;
function encodeToString(number) {
    return encodeToBytes(number)
        .map((byte) => {
        return String.fromCharCode(byte);
    })
        .join('');
}
exports.encodeToString = encodeToString;
