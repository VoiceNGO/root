"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const exists_1 = tslib_1.__importDefault(require("../exists"));
const fileName = __filename;
const dirPath = __dirname;
const filePath = (0, path_1.join)(dirPath, fileName);
const invalidFilePath = (0, path_1.resolve)('does.not.exist');
test('file that exists', async () => {
    expect(await (0, exists_1.default)(filePath)).toBe(true);
});
test('directory that exists', async () => {
    expect(await (0, exists_1.default)(dirPath)).toBe(true);
});
test('file that does not exist', async () => {
    expect(await (0, exists_1.default)(invalidFilePath)).toBe(false);
});
test('relative path', () => {
    expect((0, exists_1.default)('./foo')).rejects.toThrow();
});
