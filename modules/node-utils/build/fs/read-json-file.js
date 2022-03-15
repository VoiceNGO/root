"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const is_object_1 = tslib_1.__importDefault(require("js-utils/is-object"));
async function readJsonFile(srcFolder, fileName) {
    const srcPath = (0, path_1.join)(srcFolder, fileName);
    const fileContents = await (0, promises_1.readFile)(srcPath);
    try {
        const json = JSON.parse(fileContents.toString());
        if (!(0, is_object_1.default)(json)) {
            throw new Error(`Unexpected contents of JSON file: ${srcPath}`);
        }
        return json;
    }
    catch {
        throw new Error(`Failed to parse JSON: ${srcPath}`);
    }
}
exports.default = readJsonFile;
