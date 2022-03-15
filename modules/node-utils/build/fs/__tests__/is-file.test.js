"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const is_file_1 = tslib_1.__importDefault(require("../is-file"));
const fileName = __filename;
const dirPath = __dirname;
const filePath = (0, path_1.join)(dirPath, fileName);
const linkPath = (0, path_1.resolve)('is-symbolic-link.link');
test('File', async () => {
    expect(await (0, is_file_1.default)(filePath)).toBe(true);
});
test('Directory', async () => {
    expect(await (0, is_file_1.default)(dirPath)).toBe(false);
});
test('Symlink', async () => {
    expect(await (0, is_file_1.default)(linkPath)).toBe(false);
});
test('relative path', () => {
    expect((0, is_file_1.default)('./foo')).rejects.toThrow();
});
