"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = __importDefault(require("expect"));
const path_1 = require("path");
const is_file_1 = __importDefault(require("../is-file"));
const filePath = __filename;
const dirPath = __dirname;
const linkPath = (0, path_1.resolve)('is-symbolic-link.link');
test('File', async () => {
    (0, expect_1.default)(await (0, is_file_1.default)(filePath)).toBe(true);
});
test('Directory', async () => {
    (0, expect_1.default)(await (0, is_file_1.default)(dirPath)).toBe(false);
});
test('Symlink', async () => {
    (0, expect_1.default)(await (0, is_file_1.default)(linkPath)).toBe(false);
});
test('relative path', () => {
    (0, expect_1.default)((0, is_file_1.default)('./foo')).rejects.toThrow();
});
