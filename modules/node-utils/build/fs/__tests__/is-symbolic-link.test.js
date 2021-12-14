"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const expect_1 = __importDefault(require("expect"));
const is_symbolic_link_1 = __importDefault(require("../is-symbolic-link"));
const filePath = __filename;
const dirPath = __dirname;
const linkPath = (0, path_1.resolve)(__dirname, './is-symbolic-link.link');
test('File', async () => {
    (0, expect_1.default)(await (0, is_symbolic_link_1.default)(filePath)).toBe(false);
});
test('Directory', async () => {
    (0, expect_1.default)(await (0, is_symbolic_link_1.default)(dirPath)).toBe(false);
});
test('Symlink', async () => {
    (0, expect_1.default)(await (0, is_symbolic_link_1.default)(linkPath)).toBe(true);
});
test('relative path', () => {
    (0, expect_1.default)((0, is_symbolic_link_1.default)('./foo')).rejects.toThrow();
});
