import { invert, pick } from '../object.js';

test('invert', () => {
  expect(invert({ x: 10, y: 20, z: {} })).toEqual({
    '10': 'x',
    '20': 'y',
    '[object Object]': 'z',
  });
});

test('pick', () => {
  const xyz = { x: 10, y: 20, z: 30 };

  expect(pick(xyz)).toEqual({});
  expect(pick(xyz, 'x')).toEqual({ x: 10 });
  expect(pick(xyz, 'x', 'y')).toEqual({ x: 10, y: 20 });
  expect(pick(xyz, 'x', 'y', 'z')).toEqual({ x: 10, y: 20, z: 30 });
});
