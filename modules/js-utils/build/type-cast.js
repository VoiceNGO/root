"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFileName = void 0;
function toFileName(fileName) {
    if (/\//.test(fileName)) {
        throw new Error(`/ detected in filename ${fileName}`);
    }
    if (fileName === '') {
        throw new Error('filename must not be empty');
    }
    return fileName;
}
exports.toFileName = toFileName;
