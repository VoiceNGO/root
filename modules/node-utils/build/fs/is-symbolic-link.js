"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const promises_1 = require("fs/promises");
const path_1 = require("path");
const gen_await_1 = require("js-utils/gen-await");
async function isSymbolicLink(nodePath) {
    (0, assert_1.default)((0, path_1.isAbsolute)(nodePath), 'non-absolute path passed to isSymbolicLink');
    const stats = await (0, gen_await_1.genNull)((0, promises_1.lstat)(nodePath));
    return Boolean(stats?.isSymbolicLink());
}
exports.default = isSymbolicLink;
