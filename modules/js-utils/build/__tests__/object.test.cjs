"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const expect_1 = (0, tslib_1.__importDefault)(require("expect"));
const object_js_1 = (0, tslib_1.__importDefault)(require("../object.js"));
test('invert', () => {
    (0, expect_1.default)(object_js_1.default.invert({ x: 10, y: 20, z: {} })).toEqual({
        '10': 'x',
        '20': 'y',
        '[object Object]': 'z',
    });
});
