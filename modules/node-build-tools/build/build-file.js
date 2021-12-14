"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("node-utils/fs");
const index_js_1 = require("./file-builders/index.js");
async function buildFile(srcPath) {
    const extension = (0, fs_1.getTwoDotExtension)(srcPath);
    const builder = {
        'd.ts': index_js_1.copy,
        styl: index_js_1.styl,
        ts: index_js_1.ts,
        tsx: index_js_1.ts,
    }[extension];
    if (!builder) {
        throw new Error(`No builder available for file extension "${extension}"`);
    }
    builder.buildFile(srcPath);
}
exports.default = buildFile;
