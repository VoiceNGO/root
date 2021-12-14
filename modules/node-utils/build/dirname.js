"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filename = exports.dirname = void 0;
const url_1 = require("url");
const path_1 = require("path");
function dirname(importMeta) {
    return (0, path_1.dirname)(filename(importMeta));
}
exports.dirname = dirname;
function filename(importMeta) {
    return importMeta.url ? (0, url_1.fileURLToPath)(importMeta.url) : '';
}
exports.filename = filename;
