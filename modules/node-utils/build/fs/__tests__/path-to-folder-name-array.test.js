"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_to_folder_name_array_1 = tslib_1.__importDefault(require("../path-to-folder-name-array"));
test('relative path', () => {
    expect((0, path_to_folder_name_array_1.default)('foo/bar/baz')).toEqual([
        'foo',
        'bar',
        'baz',
    ]);
});
test('absolute path', () => {
    expect((0, path_to_folder_name_array_1.default)('/foo/bar/baz')).toEqual([
        'foo',
        'bar',
        'baz',
    ]);
});
