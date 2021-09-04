import expect from 'expect';
import { object } from '..';

test('invert', () => {
  expect(object.invert({ x: 10, y: 20, z: {} })).toEqual({
    '10': 'x',
    '20': 'y',
    '[object Object]': 'z',
  });
});
