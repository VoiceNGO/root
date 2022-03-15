import isObject from '../is-object';

describe('isObject', () => {
  test('Things that should be considered objects', () => {
    expect(isObject({})).toBe(true);
  });

  test('Things that should not be considered objects', () => {
    [null, 0, '0', undefined, [], () => {}, new Set(), new Map()].forEach(
      (thing) => expect(isObject(thing)).toBe(false)
    );
  });
});
