"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const get_two_dot_extension_1 = tslib_1.__importDefault(require("../get-two-dot-extension"));
const extensionsToTest = [
    ['file.ts', 'ts'],
    ['/path/to/file.ts', 'ts'],
    ['file.d.ts', 'd.ts'],
    ['/path/to/file.d.ts', 'd.ts'],
    ['file.abcdefg.hijklm', 'hijklm'],
    ['file', ''],
    ['/path/to/file', ''],
    ['/path.to/file', ''],
    ['', ''],
];
describe('file extensions', () => {
    test.each(extensionsToTest)('fn(%s) = %s', (filePath, extension) => {
        expect((0, get_two_dot_extension_1.default)(filePath)).toBe(extension);
    });
});
