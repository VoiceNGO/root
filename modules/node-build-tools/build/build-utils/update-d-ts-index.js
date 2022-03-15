"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const globby_1 = require("globby");
const generated_file_header_1 = tslib_1.__importDefault(require("./generated-file-header"));
const err_1 = tslib_1.__importDefault(require("js-utils/err/err"));
const promises_1 = require("fs/promises");
const exists_1 = tslib_1.__importDefault(require("node-utils/fs/exists"));
async function updateDTSIndex(srcFolder) {
    const indexFileName = (0, path_1.join)(srcFolder, 'index.d.ts');
    if (!(await okayToReplaceIndex(indexFileName))) {
        throw new err_1.default(`Cowardly refusing to overwrite non-generated index file at ${indexFileName}`);
    }
    const indexContents = await genDTSIndexContents(srcFolder);
    await (0, promises_1.writeFile)(indexFileName, indexContents);
}
exports.default = updateDTSIndex;
async function okayToReplaceIndex(indexFileName) {
    const indexExists = await (0, exists_1.default)(indexFileName);
    if (!indexExists)
        return true;
    const indexContents = await (0, promises_1.readFile)(indexFileName);
    const foundFileHeader = indexContents.indexOf(generated_file_header_1.default) >= 0;
    return foundFileHeader;
}
async function genDTSIndexContents(srcFolder) {
    const dtsGlob = `${srcFolder}/**/*.d.ts`;
    const dtsFiles = await (0, globby_1.globby)(dtsGlob);
    return (generated_file_header_1.default +
        dtsFiles.map((filePath) => `/// <reference path="${filePath}" />\n`));
}
