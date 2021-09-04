import expect from 'expect';
import { string } from '..';

test('replaces the last occurrence of a string, and only the last occurrence', () => {
  expect(string.replaceLastOccurrence('a/b/c/a/b/c/a', '/a', '/z')).toBe(
    'a/b/c/a/b/c/z'
  );
});

test('startsWithUpperCase', () => {
  expect(string.startsWithUpperCase('foo')).toBe(false);
  expect(string.startsWithUpperCase('Foo')).toBe(true);
});

test('toCamelCase', () => {
  expect(string.toCamelCase('foo-bar-baz')).toBe('fooBarBaz');
  expect(string.toCamelCase('fooBarBaz')).toBe('fooBarBaz');
  expect(string.toCamelCase('FooBarBaz')).toBe('fooBarBaz');
});

test('toPascalCase', () => {
  expect(string.toPascalCase('foo-bar-baz')).toBe('FooBarBaz');
  expect(string.toPascalCase('fooBarBaz')).toBe('FooBarBaz');
  expect(string.toPascalCase('FooBarBaz')).toBe('FooBarBaz');
});

test('toDashedCase', () => {
  expect(string.toDashedCase('foo-bar-baz')).toBe('foo-bar-baz');
  expect(string.toDashedCase('fooBarBaz')).toBe('foo-bar-baz');
  expect(string.toDashedCase('FooBarBaz')).toBe('foo-bar-baz');
});
