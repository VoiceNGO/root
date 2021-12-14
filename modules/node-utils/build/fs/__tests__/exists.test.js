"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = __importDefault(require("expect"));
const path_1 = require("path");
const exists_1 = __importDefault(require("../exists"));
const filePath = __filename;
const dirPath = __dirname;
const invalidFilePath = (0, path_1.resolve)('does.not.exist');
test('file that exists', async () => {
    (0, expect_1.default)(await (0, exists_1.default)(filePath)).toBe(true);
});
test('directory that exists', async () => {
    (0, expect_1.default)(await (0, exists_1.default)(dirPath)).toBe(true);
});
test('file that does not exist', async () => {
    (0, expect_1.default)(await (0, exists_1.default)(invalidFilePath)).toBe(false);
});
test('relative path', () => {
    (0, expect_1.default)((0, exists_1.default)('./foo')).rejects.toThrow();
});
