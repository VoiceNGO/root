import Err from '../err/index.js';

import expect from 'expect';
import {
  gen,
  genNull,
  genEnforce,
  genAll,
  genAllNull,
  genAllEnforce,
} from '../gen-await';

const pass = () => Promise.resolve(42);
const pass2 = () => Promise.resolve(43);
const fail = () => Promise.reject(42); // eslint-disable-line prefer-promise-reject-errors
const fail2 = () => Promise.reject(43); // eslint-disable-line prefer-promise-reject-errors
const passNull = () => Promise.resolve(null);
const passWithTimeout = (timeout = 100) =>
  new Promise((resolve) => {
    setTimeout(resolve.bind(null, 42), timeout);
  });

test('gen catches errors', async () => {
  expect(await gen(fail())).toEqual([new Err('42'), null]);
});

test('gen passes through values', async () => {
  expect(await gen(pass())).toEqual([null, 42]);
});

test('genNull resolves', async () => {
  expect(await genNull(pass())).toBe(42);
});

test('genNull swallows rejected promise and returns null', async () => {
  expect(await genNull(fail())).toBe(null);
});

test('genNull swallows errors and returns null', async () => {
  expect(
    await genNull(
      Promise.resolve().then(() => {
        throw new Err('42');
      })
    )
  ).toBe(null);
});

test('genEnforce resolves', async () => {
  expect(await genEnforce(pass())).toBe(42);
});

test('genEnforce rejects null values', async () => {
  await expect(genEnforce(passNull())).rejects.toEqual(
    new Err('promise did not return a value to genEnforce')
  );
});

test('genAll passes through successful values', async () => {
  expect(await genAll(pass(), pass2())).toEqual([null, [42, 43]]);
});

test('genAll catches an array of errors', async () => {
  expect(await genAll(fail(), fail2())).toEqual([
    [new Err('42'), new Err('43')],
    [null, null],
  ]);
});

test('genAll passes through mixed pass/fail values', async () => {
  expect(await genAll(pass(), fail(), pass2(), fail2())).toEqual([
    [null, new Err('42'), null, new Err('43')],
    [42, null, 43, null],
  ]);
});

test('genAllNull passes through values', async () => {
  expect(await genAllNull(pass(), pass2())).toEqual([42, 43]);
});

test('genAllNull swallows errors and returns null', async () => {
  expect(await genAllNull(fail(), fail2())).toEqual([null, null]);
});

test('genAllNull passes through mixed pass/fail values', async () => {
  expect(await genAllNull(pass(), fail(), pass2(), fail2())).toEqual([
    42,
    null,
    43,
    null,
  ]);
});

test('genAllEnforce passes through an array of non-null values', async () => {
  expect(await genAllEnforce(pass(), pass2())).toEqual([42, 43]);
});

test('genAllEnforce rejects all promises if any throw or do not return a value', async () => {
  await expect(genAllEnforce(pass(), fail())).rejects.toEqual(
    new Err(`promise threw '42' to genEnforce`)
  );
  await expect(genAllEnforce(pass(), passNull())).rejects.toEqual(
    new Err('promise did not return a value to genEnforce')
  );
});

test('All functions run in parallel', async () => {
  const start = Date.now();
  await Promise.all([
    genAll(passWithTimeout(), passWithTimeout()),
    genAllNull(passWithTimeout(), passWithTimeout()),
    genAllEnforce(passWithTimeout(), passWithTimeout()),
  ]);
  const time = Date.now() - start;
  expect(Math.abs(time - 100)).toBeLessThan(50);
});
