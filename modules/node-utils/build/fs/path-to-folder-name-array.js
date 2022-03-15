"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importStar(require("path"));
function pathToFolderNameArray(dirPath) {
    const splitPath = dirPath.split(path_1.default.sep);
    const pathIsAbsolute = (0, path_1.isAbsolute)(dirPath);
    if (pathIsAbsolute) {
        splitPath.splice(0, 1);
    }
    return splitPath;
}
exports.default = pathToFolderNameArray;
