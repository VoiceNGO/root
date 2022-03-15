"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const is_object_1 = tslib_1.__importDefault(require("../is-object"));
describe('isObject', () => {
    test('Things that should be considered objects', () => {
        expect((0, is_object_1.default)({})).toBe(true);
    });
    test('Things that should not be considered objects', () => {
        [null, 0, '0', undefined, [], () => { }, new Set(), new Map()].forEach((thing) => expect((0, is_object_1.default)(thing)).toBe(false));
    });
});
