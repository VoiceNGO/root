"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../string");
test('replaces the last occurrence of a string, and only the last occurrence', () => {
    expect((0, string_1.replaceLastOccurrence)('a/b/c/a/b/c/a', '/a', '/z')).toBe('a/b/c/a/b/c/z');
});
test('startsWithUpperCase', () => {
    expect((0, string_1.startsWithUpperCase)('foo')).toBe(false);
    expect((0, string_1.startsWithUpperCase)('Foo')).toBe(true);
});
const inputCases = ['foo-bar-baz', 'fooBarBaz', 'FooBarBaz'];
test('toCamelCase', () => {
    inputCases.forEach((input) => expect((0, string_1.toCamelCase)(input)).toBe('fooBarBaz'));
});
test('toPascalCase', () => {
    inputCases.forEach((input) => expect((0, string_1.toPascalCase)(input)).toBe('FooBarBaz'));
});
test('toKebabCase', () => {
    inputCases.forEach((input) => expect((0, string_1.toKebabCase)(input)).toBe('foo-bar-baz'));
});
