import {
  replaceLastOccurrence,
  startsWithUpperCase,
  toCamelCase,
  toPascalCase,
  toKebabCase,
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

const inputCases = ['foo-bar-baz', 'fooBarBaz', 'FooBarBaz'];

test('toCamelCase', () => {
  inputCases.forEach((input) => expect(toCamelCase(input)).toBe('fooBarBaz'));
});

test('toPascalCase', () => {
  inputCases.forEach((input) => expect(toPascalCase(input)).toBe('FooBarBaz'));
});

test('toKebabCase', () => {
  inputCases.forEach((input) => expect(toKebabCase(input)).toBe('foo-bar-baz'));
});
