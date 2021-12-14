"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const expect_1 = __importDefault(require("expect"));
const __1 = require("..");
const dir_is_empty_1 = __importDefault(require("../dir-is-empty"));
const path_1 = require("path");
const emptyDir = (0, path_1.resolve)('__dir-is-empty-test__');
const nonEmptyDir = __dirname;
afterAll(async () => {
    try {
        await (0, promises_1.unlink)(emptyDir);
    }
    catch { }
});
test('Empty directory', async () => {
    await (0, __1.mkdirp)(emptyDir);
    (0, expect_1.default)(await (0, dir_is_empty_1.default)(emptyDir)).toBe(true);
});
test('Non-empty directory', async () => {
    (0, expect_1.default)(await (0, dir_is_empty_1.default)(nonEmptyDir)).toBe(false);
});
test('relative path', () => {
    (0, expect_1.default)((0, dir_is_empty_1.default)('./foo')).rejects.toThrow();
});
