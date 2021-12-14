"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
async function writeJsonFile(filePath, contents) {
    (0, promises_1.writeFile)(filePath, JSON.stringify(contents, undefined, 2));
}
exports.default = writeJsonFile;
