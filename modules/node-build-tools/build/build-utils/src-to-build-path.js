"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function srcToBuildPath(srcPath) {
    // replaces only the last occurance of `src/`
    return srcPath.replace(/\bsrc\/(?!.*\bsrc\/)/, `build/`);
}
exports.default = srcToBuildPath;
