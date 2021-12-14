"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const is_object_1 = __importDefault(require("js-utils/is-object"));
async function readJsonFile(srcPath) {
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
