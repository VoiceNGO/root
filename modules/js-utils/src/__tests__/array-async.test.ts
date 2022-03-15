import * as arrayAsync from '../array-async';
import Err from '../err';

const {
  every,
  everyIgnoreErrors,
  map,
  mapIgnoreErrors,
  filter,
  filterIgnoreErrors,
  forEach,
  forEachIgnoreErrors,
} = arrayAsync;

const ODD_ERR_TEXT = 'Odd numbers are forbidden!';
const TIMEOUT = 30;
const EXPECTED_ODD_ERROR = new Err(ODD_ERR_TEXT);

const timeout = (timer = TIMEOUT) =>
  new Promise((resolve) => {
    setTimeout(resolve, timer);
  });
const isOdd = async (n: number) => {
  await timeout(TIMEOUT);

  return n & 1;
};
const toOdd = async (n: number) => {
  await timeout(TIMEOUT);

  return 2 * n + 1;
};
const oddThrows = async (n: any) => {
  await timeout(TIMEOUT);

  if (n & 1) {
    throw EXPECTED_ODD_ERROR;
  }

  return n;
};

const numAry: Array<number> = Array.from({ length: 100 }).map((n, i) => i);
const oddAry = numAry.map((n) => 2 * n + 1);
const oddsNullAry = numAry.map((n) => (n & 1 ? null : n));
const oddFilteredAry = numAry.filter((n) => n & 1);
const evenFilteredAry = numAry.filter((n) => n && !(n & 1));

test('every filters out some falsy values', async () => {
  expect((await every(numAry, isOdd))[1]).toBe(false);
});

test('every passes all truthy values', async () => {
  expect((await every(oddAry, isOdd))[1]).toBe(true);
});

test('every throws when callback throws', async () => {
  expect((await every(numAry, oddThrows))[0]).toEqual(EXPECTED_ODD_ERROR);
});

test('everyIgnoreErrors filters out some falsy values', async () => {
  expect(await everyIgnoreErrors(numAry, isOdd)).toBe(false);
});

test('everyIgnoreErrors passes all truthy values', async () => {
  expect(await everyIgnoreErrors(oddAry, isOdd)).toBe(true);
});

test('everyIgnoreErrors swallows callback errors and returns false', async () => {
  expect(await everyIgnoreErrors(numAry, oddThrows)).toBe(false);
});

test('every runs in parallel', async () => {
  const start = Date.now();
  await every(numAry, isOdd);
  const time = Date.now() - start;
  expect(time).toBeGreaterThan(TIMEOUT - 10);
  expect(time).toBeLessThan(TIMEOUT * 5);
});

test('map properly maps values', async () => {
  expect((await map(numAry, toOdd))[1]).toEqual(oddAry);
});

test('map throws when callback throws', async () => {
  expect((await map(numAry, oddThrows))[0]).toEqual(EXPECTED_ODD_ERROR);
});

test('map runs in parallel', async () => {
  const start = Date.now();
  await map(numAry, toOdd);
  const time = Date.now() - start;
  expect(time).toBeGreaterThan(TIMEOUT - 10);
  expect(time).toBeLessThan(TIMEOUT * 5);
});

test('map properly maps values', async () => {
  expect(await mapIgnoreErrors(numAry, toOdd)).toEqual(oddAry);
});

test('mapIgnoreErrors maps errors to null', async () => {
  expect(await mapIgnoreErrors(numAry, oddThrows)).toEqual(oddsNullAry);
});

test('filter filters out values', async () => {
  expect((await filter(numAry, isOdd))[1]).toEqual(oddFilteredAry);
});

test('filter throws when callback throws', async () => {
  expect((await filter(numAry, oddThrows))[0]).toEqual(EXPECTED_ODD_ERROR);
});

test('filterIgnoreErrors swallows errors and removes them from result', async () => {
  expect(await filterIgnoreErrors(numAry, oddThrows)).toEqual(evenFilteredAry);
});

test('forEach runs on each element and returns null', async () => {
  const newAry: number[] = [];
  const multiplier = (value: number, index: number) =>
    (newAry[index] = 2 * value + 1);
  const retVal = await forEach(numAry, multiplier);
  expect(newAry).toEqual(oddAry);
  expect(retVal).toEqual(null);
});

test('forEach throws when callback throws', async () => {
  expect(await forEach(numAry, oddThrows)).toEqual(EXPECTED_ODD_ERROR);
});

test('forEachIgnoreErrors swallows errors', async () => {
  expect(await forEachIgnoreErrors(numAry, oddThrows)).toEqual(undefined);
});
