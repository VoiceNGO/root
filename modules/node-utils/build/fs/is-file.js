"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const promises_1 = require("fs/promises");
const path_1 = require("path");
const gen_await_1 = require("js-utils/gen-await");
async function isFile(nodePath) {
    (0, assert_1.default)((0, path_1.isAbsolute)(nodePath), 'non-absolute path passed to isFile');
    const stats = await (0, gen_await_1.genNull)((0, promises_1.lstat)(nodePath));
    return Boolean(stats?.isFile());
}
exports.default = isFile;
