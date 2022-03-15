"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const src_to_build_path_1 = tslib_1.__importDefault(require("../src-to-build-path"));
test('replaces src with build', () => {
    // @ts-ignore
    expect((0, src_to_build_path_1.default)('/foo/src/bar')).toBe('/foo/build/bar');
});
test('only replaces last src with build', () => {
    // @ts-ignore
    expect((0, src_to_build_path_1.default)('/foo/src/bar/src/baz')).toBe('/foo/src/bar/build/baz');
});
