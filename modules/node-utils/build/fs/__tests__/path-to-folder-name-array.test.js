"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = __importDefault(require("expect"));
const path_to_folder_name_array_1 = __importDefault(require("../path-to-folder-name-array"));
test('relative path', () => {
    (0, expect_1.default)((0, path_to_folder_name_array_1.default)('foo/bar/baz')).toEqual([
        'foo',
        'bar',
        'baz',
    ]);
});
test('absolute path', () => {
    (0, expect_1.default)((0, path_to_folder_name_array_1.default)('/foo/bar/baz')).toEqual([
        'foo',
        'bar',
        'baz',
    ]);
});
