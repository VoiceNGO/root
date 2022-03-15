"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const promises_1 = require("fs/promises");
const path_1 = require("path");
const is_directory_js_1 = tslib_1.__importDefault(require("./is-directory.js"));
async function dirIsEmpty(nodePath) {
    (0, assert_1.default)((0, path_1.isAbsolute)(nodePath), 'non-absolute path passed to dirIsEmpty');
    const fileIsDirectory = await (0, is_directory_js_1.default)(nodePath);
    (0, assert_1.default)(fileIsDirectory, `dirIsEmpty called on non-directory ${nodePath}`);
    const dirContents = await (0, promises_1.readdir)(nodePath);
    return Boolean(dirContents) && dirContents.length === 0;
}
exports.default = dirIsEmpty;
