"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const path_1 = tslib_1.__importDefault(require("path"));
const mkdirp_1 = tslib_1.__importDefault(require("../mkdirp"));
const exists_1 = tslib_1.__importDefault(require("../exists"));
const TEST_DIR = '__mkdirp-test__';
async function removeTestDir() {
    try {
        await (0, promises_1.unlink)(TEST_DIR);
    }
    catch { }
}
beforeEach(removeTestDir);
afterAll(removeTestDir);
test('creates nested directories from absolute path', async () => {
    const dirPath = path_1.default.resolve(TEST_DIR, 'foo', 'bar', 'baz');
    await (0, mkdirp_1.default)(dirPath);
    expect(await (0, exists_1.default)(dirPath)).toBe(true);
});
test('relative path', () => {
    expect((0, mkdirp_1.default)('./foo')).rejects.toThrow();
});
