import expect from 'expect';
import {
  replaceLastOccurrence,
  startsWithUpperCase,
  toCamelCase,
  toPascalCase,
  toDashedCase,
} from '../string';

test('replaces the last occurrence of a string, and only the last occurrence', () => {
  expect(replaceLastOccurrence('a/b/c/a/b/c/a', '/a', '/z')).toBe(
    'a/b/c/a/b/c/z'
  );
});

test('startsWithUpperCase', () => {
  expect(startsWithUpperCase('foo')).toBe(false);
  expect(startsWithUpperCase('Foo')).toBe(true);
});

test('toCamelCase', () => {
  expect(toCamelCase('foo-bar-baz')).toBe('fooBarBaz');
  expect(toCamelCase('fooBarBaz')).toBe('fooBarBaz');
  expect(toCamelCase('FooBarBaz')).toBe('fooBarBaz');
});

test('toPascalCase', () => {
  expect(toPascalCase('foo-bar-baz')).toBe('FooBarBaz');
  expect(toPascalCase('fooBarBaz')).toBe('FooBarBaz');
  expect(toPascalCase('FooBarBaz')).toBe('FooBarBaz');
});

test('toDashedCase', () => {
  expect(toDashedCase('foo-bar-baz')).toBe('foo-bar-baz');
  expect(toDashedCase('fooBarBaz')).toBe('foo-bar-baz');
  expect(toDashedCase('FooBarBaz')).toBe('foo-bar-baz');
});
