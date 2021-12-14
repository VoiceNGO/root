"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const expect_1 = (0, tslib_1.__importDefault)(require("expect"));
const string_1 = require("../string");
test('replaces the last occurrence of a string, and only the last occurrence', () => {
    (0, expect_1.default)((0, string_1.replaceLastOccurrence)('a/b/c/a/b/c/a', '/a', '/z')).toBe('a/b/c/a/b/c/z');
});
test('startsWithUpperCase', () => {
    (0, expect_1.default)((0, string_1.startsWithUpperCase)('foo')).toBe(false);
    (0, expect_1.default)((0, string_1.startsWithUpperCase)('Foo')).toBe(true);
});
test('toCamelCase', () => {
    (0, expect_1.default)((0, string_1.toCamelCase)('foo-bar-baz')).toBe('fooBarBaz');
    (0, expect_1.default)((0, string_1.toCamelCase)('fooBarBaz')).toBe('fooBarBaz');
    (0, expect_1.default)((0, string_1.toCamelCase)('FooBarBaz')).toBe('fooBarBaz');
});
test('toPascalCase', () => {
    (0, expect_1.default)((0, string_1.toPascalCase)('foo-bar-baz')).toBe('FooBarBaz');
    (0, expect_1.default)((0, string_1.toPascalCase)('fooBarBaz')).toBe('FooBarBaz');
    (0, expect_1.default)((0, string_1.toPascalCase)('FooBarBaz')).toBe('FooBarBaz');
});
test('toDashedCase', () => {
    (0, expect_1.default)((0, string_1.toDashedCase)('foo-bar-baz')).toBe('foo-bar-baz');
    (0, expect_1.default)((0, string_1.toDashedCase)('fooBarBaz')).toBe('foo-bar-baz');
    (0, expect_1.default)((0, string_1.toDashedCase)('FooBarBaz')).toBe('foo-bar-baz');
});
