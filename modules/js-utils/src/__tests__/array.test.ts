import { filterInPlace } from '../array';

describe('filterInPlace', () => {
  const srcArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let testArray: number[];

  beforeEach(() => {
    testArray = srcArray.slice();
  });

  test('returns same array', () => {
    const response = filterInPlace(testArray, () => true);
    expect(response).toBe(testArray);
  });

  test('filter odds', () => {
    expect(filterInPlace(testArray, (n) => Boolean(n & 1))).toEqual([
      1, 3, 5, 7, 9,
    ]);
  });
});
