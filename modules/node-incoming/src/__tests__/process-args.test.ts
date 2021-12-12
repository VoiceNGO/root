/* eslint-disable max-nested-callbacks */

import expect from 'expect';
import { processArgs } from '../process-args';

// --command
// --command=foo
// --command foo
// -a
// -abc
// -abc
// -a=foo
// -a foo

describe('processArgs command splitting', () => {
  const tests = [
    [['--flag'], { flag: { boolean: true } }, { flag: true }],
    [['--flag=foo'], {}, { flag: 'foo' }],
    [['--flag=foo bar baz'], {}, { flag: 'foo bar baz' }],
    [['--flag', 'foo'], {}, { flag: 'foo' }],
    [['--flag', 'foo bar baz'], {}, { flag: 'foo bar baz' }],
    [
      ['--flag', 'foo'],
      { flag: { boolean: true } },
      { flag: true, _: ['foo'] },
    ],
    [['-a=foo'], {}, { a: 'foo' }],
    [['-a=foo bar baz'], {}, { a: 'foo bar baz' }],
    [['-a', 'foo'], {}, { a: 'foo' }],
    [['-a', 'foo bar baz'], {}, { a: 'foo bar baz' }],
    [['-a'], { a: { boolean: true } }, { a: true }],
    [
      ['-abc'],
      { a: { boolean: true }, b: { boolean: true }, c: { boolean: true } },
      { a: true, b: true, c: true },
    ],
    [['-a'], { a: { boolean: true } }, { a: true }],
    [['-a'], { a: { long: 'apple' } }, { apple: true }],
    [
      ['--foo', '--bar', '42', '-abc', '-d', '43', 'the', 'quick', 'fox'],
      {
        foo: { boolean: true },
        a: { boolean: true },
        b: { boolean: true },
        c: { boolean: true },
      },
      {
        foo: true,
        bar: '42',
        a: true,
        b: true,
        c: true,
        d: '43',
        _: ['the', 'quick', 'fox'],
      },
    ],
  ];

  const testsToError = [
    [['--foo', '--bar'], {}],
    [
      ['-abc=42'],
      { a: { boolean: true }, b: { boolean: true }, c: { boolean: true } },
    ],
    [['-abc=42'], { a: { boolean: true }, b: { boolean: true } }],
  ];

  test('Expected processArgs output', () => {
    tests.forEach(([input, config, output]) => {
      expect(processArgs(input, config)).toEqual(output);
    });
  });

  test('Expected processArgs to throw', () => {
    testsToError.forEach(([input, config]) => {
      expect(processArgs(input, config)).toThrow();
    });
  });
});
