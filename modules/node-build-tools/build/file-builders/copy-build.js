"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildFiles = exports.buildFile = void 0;
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const src_to_build_path_1 = tslib_1.__importDefault(require("../build-utils/src-to-build-path"));
async function buildFile(srcPath) {
    const buildPath = (await getBuildFiles(srcPath))[0];
    const fileContents = await (0, promises_1.readFile)(srcPath);
    return { [buildPath]: fileContents };
}
exports.buildFile = buildFile;
async function getBuildFiles(srcPath) {
    const buildPath = (0, src_to_build_path_1.default)(srcPath);
    return [buildPath];
}
exports.getBuildFiles = getBuildFiles;
