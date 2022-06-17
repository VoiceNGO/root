"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildFiles = exports.buildFile = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const src_to_build_path_1 = tslib_1.__importDefault(require("../build-utils/src-to-build-path"));
async function buildFile(srcPath) {
    return {};
}
exports.buildFile = buildFile;
async function getBuildFiles(srcPath) {
    const buildPath = (0, src_to_build_path_1.default)(srcPath);
    const parsedBuildPath = (0, path_1.parse)(buildPath);
    const cssBuildPath = `${parsedBuildPath.dir}/${parsedBuildPath.name}.css`;
    return [cssBuildPath];
}
exports.getBuildFiles = getBuildFiles;
