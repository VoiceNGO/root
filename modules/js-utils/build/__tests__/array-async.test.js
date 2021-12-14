"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const expect_1 = (0, tslib_1.__importDefault)(require("expect"));
const arrayAsync = (0, tslib_1.__importStar)(require("../array-async"));
const err_1 = (0, tslib_1.__importDefault)(require("../err"));
const { every, everyIgnoreErrors, map, mapIgnoreErrors, filter, filterIgnoreErrors, forEach, forEachIgnoreErrors, } = arrayAsync;
const ODD_ERR_TEXT = 'Odd numbers are forbidden!';
const TIMEOUT = 30;
const EXPECTED_ODD_ERROR = new err_1.default(ODD_ERR_TEXT);
const timeout = (timer = TIMEOUT) => new Promise((resolve) => {
    setTimeout(resolve, timer);
});
const isOdd = async (n) => {
    await timeout(TIMEOUT);
    return n & 1;
};
const toOdd = async (n) => {
    await timeout(TIMEOUT);
    return 2 * n + 1;
};
const oddThrows = async (n) => {
    await timeout(TIMEOUT);
    if (n & 1) {
        throw EXPECTED_ODD_ERROR;
    }
    return n;
};
const numAry = Array.from({ length: 100 }).map((n, i) => i);
const oddAry = numAry.map((n) => 2 * n + 1);
const oddsNullAry = numAry.map((n) => (n & 1 ? null : n));
const oddFilteredAry = numAry.filter((n) => n & 1);
const evenFilteredAry = numAry.filter((n) => n && !(n & 1));
test('every filters out some falsy values', async () => {
    (0, expect_1.default)((await every(numAry, isOdd))[1]).toBe(false);
});
test('every passes all truthy values', async () => {
    (0, expect_1.default)((await every(oddAry, isOdd))[1]).toBe(true);
});
test('every throws when callback throws', async () => {
    (0, expect_1.default)((await every(numAry, oddThrows))[0]).toEqual(EXPECTED_ODD_ERROR);
});
test('everyIgnoreErrors filters out some falsy values', async () => {
    (0, expect_1.default)(await everyIgnoreErrors(numAry, isOdd)).toBe(false);
});
test('everyIgnoreErrors passes all truthy values', async () => {
    (0, expect_1.default)(await everyIgnoreErrors(oddAry, isOdd)).toBe(true);
});
test('everyIgnoreErrors swallows callback errors and returns false', async () => {
    (0, expect_1.default)(await everyIgnoreErrors(numAry, oddThrows)).toBe(false);
});
test('every runs in parallel', async () => {
    const start = Date.now();
    await every(numAry, isOdd);
    const time = Date.now() - start;
    (0, expect_1.default)(time).toBeGreaterThan(TIMEOUT - 10);
    (0, expect_1.default)(time).toBeLessThan(TIMEOUT * 5);
});
test('map properly maps values', async () => {
    (0, expect_1.default)((await map(numAry, toOdd))[1]).toEqual(oddAry);
});
test('map throws when callback throws', async () => {
    (0, expect_1.default)((await map(numAry, oddThrows))[0]).toEqual(EXPECTED_ODD_ERROR);
});
test('map runs in parallel', async () => {
    const start = Date.now();
    await map(numAry, toOdd);
    const time = Date.now() - start;
    (0, expect_1.default)(time).toBeGreaterThan(TIMEOUT - 10);
    (0, expect_1.default)(time).toBeLessThan(TIMEOUT * 5);
});
test('map properly maps values', async () => {
    (0, expect_1.default)(await mapIgnoreErrors(numAry, toOdd)).toEqual(oddAry);
});
test('mapIgnoreErrors maps errors to null', async () => {
    (0, expect_1.default)(await mapIgnoreErrors(numAry, oddThrows)).toEqual(oddsNullAry);
});
test('filter filters out values', async () => {
    (0, expect_1.default)((await filter(numAry, isOdd))[1]).toEqual(oddFilteredAry);
});
test('filter throws when callback throws', async () => {
    (0, expect_1.default)((await filter(numAry, oddThrows))[0]).toEqual(EXPECTED_ODD_ERROR);
});
test('filterIgnoreErrors swallows errors and removes them from result', async () => {
    (0, expect_1.default)(await filterIgnoreErrors(numAry, oddThrows)).toEqual(evenFilteredAry);
});
test('forEach runs on each element and returns null', async () => {
    const newAry = [];
    const multiplier = (value, index) => (newAry[index] = 2 * value + 1);
    const retVal = await forEach(numAry, multiplier);
    (0, expect_1.default)(newAry).toEqual(oddAry);
    (0, expect_1.default)(retVal).toEqual(null);
});
test('forEach throws when callback throws', async () => {
    (0, expect_1.default)(await forEach(numAry, oddThrows)).toEqual(EXPECTED_ODD_ERROR);
});
test('forEachIgnoreErrors swallows errors', async () => {
    (0, expect_1.default)(await forEachIgnoreErrors(numAry, oddThrows)).toEqual(undefined);
});
