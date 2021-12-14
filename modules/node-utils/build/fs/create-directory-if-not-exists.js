"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const promises_1 = require("fs/promises");
const path_1 = require("path");
const index_js_1 = require("./index.js");
async function createDirectoryIfNotExists(dirPath) {
    (0, assert_1.default)((0, path_1.isAbsolute)(dirPath), 'non-absolute path passed to createDirectoryIfNotExists');
    const dirExists = await (0, index_js_1.exists)(dirPath);
    const ERR_CODE_EXISTS = 'EEXIST';
    if (!dirExists) {
        try {
            await (0, promises_1.mkdir)(dirPath);
        }
        catch (err) {
            // It is technically possible that this directory was created after the above `exists` check in situations like
            // async creating a bunch of files/directories.  So ignore the EEXIST error since it has no effect
            if (err instanceof Error &&
                err.code !== ERR_CODE_EXISTS) {
                throw err;
            }
        }
    }
}
exports.default = createDirectoryIfNotExists;
