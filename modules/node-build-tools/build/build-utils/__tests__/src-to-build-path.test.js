"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const src_to_build_path_js_1 = (0, tslib_1.__importDefault)(require("../src-to-build-path.js"));
test('replaces src with build', () => {
    // @ts-ignore
    expect((0, src_to_build_path_js_1.default)('/foo/src/bar')).toBe('/foo/build/bar');
});
