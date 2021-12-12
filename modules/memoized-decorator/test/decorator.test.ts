/* eslint-disable no-magic-numbers, @typescript-eslint/ban-types */
import expect from 'expect';
import memoize from '../src';

let instances = 0;
const getObjWithMemoizedFunction = (): {
  constructor: Function;
  fn: (...args: unknown[]) => { instanceNum: number; callCount: number };
} => {
  const instanceNum = ++instances;
  const fn = () => {
    fn.callCount++;

    return { instanceNum, callCount: fn.callCount };
  };
  fn.callCount = 0;

  type classType = { constructor: () => void; fn: PropertyDescriptor };
  const classObj = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor: () => {},
  } as classType;

  classObj.fn = memoize(classObj, 'myMethod', { value: fn }).value;

  return classObj;
};

test('memoizes a function', () => {
  const obj = getObjWithMemoizedFunction();
  const [a, b] = [obj.fn(), obj.fn()];

  expect(a).toBe(b);
});

test('independently memoizes functions across class instances', () => {
  const objA = getObjWithMemoizedFunction();
  const objB = getObjWithMemoizedFunction();

  const a = (objA.fn(), objA.fn());
  const b = (objB.fn(), objB.fn());

  expect(a.callCount).toEqual(b.callCount);
  expect(a.instanceNum).not.toEqual(b.instanceNum);
});

test('memoization is dependent on arguments', () => {
  const obj = getObjWithMemoizedFunction();

  const [a, b] = [obj.fn(42), obj.fn(42)];
  const [c, d] = [obj.fn(43), obj.fn(43)];
  const [e, f] = [
    obj.fn(1, null, undefined, []),
    obj.fn(1, null, undefined, []),
  ];

  expect(a).toEqual(b);
  expect(c).toEqual(d);
  expect(e).toEqual(f);
  expect(a).not.toBe(c);
  expect(a).not.toBe(e);
});
