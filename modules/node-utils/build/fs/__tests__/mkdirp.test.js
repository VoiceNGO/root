"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const expect_1 = __importDefault(require("expect"));
const mkdirp_1 = __importDefault(require("../mkdirp"));
const exists_1 = __importDefault(require("../exists"));
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
    (0, expect_1.default)(await (0, exists_1.default)(dirPath)).toBe(true);
});
test('relative path', () => {
    (0, expect_1.default)((0, mkdirp_1.default)('./foo')).rejects.toThrow();
});
