"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdatedJson = exports.getFolderMapping = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const globby_1 = require("globby");
const src_to_build_path_js_1 = (0, tslib_1.__importDefault)(require("./src-to-build-path.js"));
const read_json_file_1 = (0, tslib_1.__importDefault)(require("node-utils/fs/read-json-file"));
const write_json_file_1 = (0, tslib_1.__importDefault)(require("node-utils/fs/write-json-file"));
const gen_await_1 = require("js-utils/gen-await");
const packageJSONFileName = 'package.json';
async function getFolderMapping(projectFolder, filesToInclude) {
    const srcGlob = 'src/**/*.ts';
    const files = filesToInclude ||
        (await (0, globby_1.globby)(srcGlob, {
            cwd: projectFolder,
            ignore: ['**/__tests__/**'],
        }));
    const folderMappings = {};
    files.forEach((filePath) => {
        const parsedFile = (0, path_1.parse)(filePath);
        const isIndex = parsedFile.base === 'index.ts';
        const buildDir = (0, src_to_build_path_js_1.default)(parsedFile.dir);
        const dirWithoutSrc = parsedFile.dir.replace(/\bsrc\//, '/');
        if (isIndex) {
            folderMappings[`./${dirWithoutSrc}`] = `./${buildDir}/index.js`;
        }
        else {
            folderMappings[`./${dirWithoutSrc}/${parsedFile.name}`] = `./${buildDir}/${parsedFile.base}`;
        }
    });
    return folderMappings;
}
exports.getFolderMapping = getFolderMapping;
async function getUpdatedJson(projectFolder) {
    const packageJsonSrc = (0, path_1.join)(projectFolder, packageJSONFileName);
    const [folderMappings, packageJson] = await (0, gen_await_1.genAllEnforce)(getFolderMapping(projectFolder), (0, read_json_file_1.default)(packageJsonSrc, packageJSONFileName));
    packageJson.exports = folderMappings;
    return packageJson;
}
exports.getUpdatedJson = getUpdatedJson;
async function updatePackageJsonExports(projectFolder) {
    const packageJsonSrc = (0, path_1.join)(projectFolder, packageJSONFileName);
    const updatedJson = await getUpdatedJson(projectFolder);
    (0, write_json_file_1.default)(packageJsonSrc, updatedJson);
}
exports.default = updatePackageJsonExports;
