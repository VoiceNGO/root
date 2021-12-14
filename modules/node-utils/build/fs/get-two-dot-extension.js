"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTwoDotExtension(srcFile) {
    const splitSrc = srcFile.split('.');
    if (splitSrc.length < 2)
        return '';
    const lastTwo = splitSrc.slice(-2).join('.').toLowerCase();
    const lastOne = splitSrc.at(-1).toLowerCase();
    switch (lastTwo) {
        // all valid double-dot extensions
        case 'd.ts':
            return lastTwo;
    }
    return lastOne;
}
exports.default = getTwoDotExtension;
