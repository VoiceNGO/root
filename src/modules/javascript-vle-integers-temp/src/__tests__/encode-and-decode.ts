/* eslint max-nested-callbacks: "off", prefer-template: "off" */

import expect from 'expect';
import encode, { encodeToString } from '../encode';
import decode, { decodeVLEAtOffset } from '../decode';
const numbersToTest = [-1e9, -1e5, -1e2, -1, 0, 1, 42, 1e3, 1e6, 1e9];

describe('Encoding & Decoding', () => {
  test('should return the same results for decode(encode) for a wide variety of numbers', () => {
    numbersToTest.forEach((num) => {
      expect(decode(encode(num))).toBe(num);
    });
  });

  test('should throw on out-of-range numbers', () => {
    expect(() => encode(1e10)).toThrow();
    expect(() => encode(-1e10)).toThrow();
  });

  test('should throw deocding long data without an offset', () => {
    const data = Array.from({ length: 10 }).join(String.fromCharCode(0xff));
    expect(() => decode(data)).toThrow();
  });

  test('should throw decoding continuing data out of range', () => {
    const data = Array.from({ length: 10 }).fill(0xff) as number[];
    expect(() => decode(data)).toThrow();
  });

  test('decodeVLE should throw decoding incomplete data', () => {
    expect(() => decode([0b1, 0b1])).toThrow();
  });

  test('should decode partial data for a wide variety of numbers', () => {
    const extraData = Array.from({ length: 10 }).fill(0xff) as number[];
    numbersToTest.forEach((num) => {
      expect(
        decodeVLEAtOffset([...encode(num), ...extraData], 0)
      ).toHaveProperty('number', num);
    });
  });

  test('0 should encode to [0]', () => {
    expect(encode(0)).toEqual([0]);
  });

  // Basically this is testing decode(encode([1, 2, 3]))
  test('decodes concatenated numbers', () => {
    const encodedData = numbersToTest.map(encode).flat();
    let offset = 0;
    for (let i = 0, l = numbersToTest.length; i < l; i++) {
      const decodedData = decodeVLEAtOffset(encodedData, offset);
      expect(decodedData.number).toBe(numbersToTest[i]);
      // eslint-disable-next-line prefer-destructuring
      offset = decodedData.offset;
    }
  });
});

describe('Offset Data', () => {
  test('should decode numbers at a specified offset', () => {
    const decoded = decodeVLEAtOffset('foobar' + encodeToString(42), 6);

    expect(decoded).toHaveProperty('number', 42);
    expect(decoded).toHaveProperty('offset', 7);
  });
});
