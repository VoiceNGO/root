"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const is_directory_1 = tslib_1.__importDefault(require("../is-directory"));
const filePath = __filename;
const dirPath = __dirname;
const linkPath = (0, path_1.resolve)('./is-symbolic-link.link');
test('File', async () => {
    expect(await (0, is_directory_1.default)(filePath)).toBe(false);
});
test('Directory', async () => {
    expect(await (0, is_directory_1.default)(dirPath)).toBe(true);
});
test('Symlink', async () => {
    expect(await (0, is_directory_1.default)(linkPath)).toBe(false);
});
test('relative path', () => {
    expect((0, is_directory_1.default)('./foo')).rejects.toThrow();
});
