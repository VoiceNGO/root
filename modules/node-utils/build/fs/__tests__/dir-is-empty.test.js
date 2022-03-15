"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const __1 = require("..");
const dir_is_empty_1 = tslib_1.__importDefault(require("../dir-is-empty"));
const path_1 = require("path");
const nonEmptyDir = __dirname;
const emptyDir = (0, path_1.resolve)(__dirname, '__dir-is-empty-test__');
afterAll(async () => {
    try {
        await (0, promises_1.unlink)(emptyDir);
    }
    catch { }
});
test('Empty directory', async () => {
    await (0, __1.mkdirp)(emptyDir);
    expect(await (0, dir_is_empty_1.default)(emptyDir)).toBe(true);
});
test('Non-empty directory', async () => {
    expect(await (0, dir_is_empty_1.default)(nonEmptyDir)).toBe(false);
});
test('relative path', () => {
    expect((0, dir_is_empty_1.default)('./foo')).rejects.toThrow();
});
