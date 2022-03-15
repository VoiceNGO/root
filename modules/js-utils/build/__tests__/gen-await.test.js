"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_js_1 = tslib_1.__importDefault(require("../err/index.js"));
const gen_await_1 = require("../gen-await");
const pass = () => Promise.resolve(42);
const pass2 = () => Promise.resolve(43);
const fail = () => Promise.reject(42); // eslint-disable-line prefer-promise-reject-errors
const fail2 = () => Promise.reject(43); // eslint-disable-line prefer-promise-reject-errors
const passNull = () => Promise.resolve(null);
const passWithTimeout = (timeout = 100) => new Promise((resolve) => {
    setTimeout(resolve.bind(null, 42), timeout);
});
test('gen catches errors', async () => {
    expect(await (0, gen_await_1.gen)(fail())).toEqual([new index_js_1.default('42'), null]);
});
test('gen passes through values', async () => {
    expect(await (0, gen_await_1.gen)(pass())).toEqual([null, 42]);
});
test('genNull resolves', async () => {
    expect(await (0, gen_await_1.genNull)(pass())).toBe(42);
});
test('genNull swallows rejected promise and returns null', async () => {
    expect(await (0, gen_await_1.genNull)(fail())).toBe(null);
});
test('genNull swallows errors and returns null', async () => {
    expect(await (0, gen_await_1.genNull)(Promise.resolve().then(() => {
        throw new index_js_1.default('42');
    }))).toBe(null);
});
test('genEnforce resolves', async () => {
    expect(await (0, gen_await_1.genEnforce)(pass())).toBe(42);
});
test('genEnforce rejects null values', async () => {
    await expect((0, gen_await_1.genEnforce)(passNull())).rejects.toEqual(new index_js_1.default('promise did not return a value to genEnforce'));
});
test('genAll passes through successful values', async () => {
    expect(await (0, gen_await_1.genAll)(pass(), pass2())).toEqual([null, [42, 43]]);
});
test('genAll catches an array of errors', async () => {
    expect(await (0, gen_await_1.genAll)(fail(), fail2())).toEqual([
        [new index_js_1.default('42'), new index_js_1.default('43')],
        [null, null],
    ]);
});
test('genAll passes through mixed pass/fail values', async () => {
    expect(await (0, gen_await_1.genAll)(pass(), fail(), pass2(), fail2())).toEqual([
        [null, new index_js_1.default('42'), null, new index_js_1.default('43')],
        [42, null, 43, null],
    ]);
});
test('genAllNull passes through values', async () => {
    expect(await (0, gen_await_1.genAllNull)(pass(), pass2())).toEqual([42, 43]);
});
test('genAllNull swallows errors and returns null', async () => {
    expect(await (0, gen_await_1.genAllNull)(fail(), fail2())).toEqual([null, null]);
});
test('genAllNull passes through mixed pass/fail values', async () => {
    expect(await (0, gen_await_1.genAllNull)(pass(), fail(), pass2(), fail2())).toEqual([
        42,
        null,
        43,
        null,
    ]);
});
test('genAllEnforce passes through an array of non-null values', async () => {
    expect(await (0, gen_await_1.genAllEnforce)(pass(), pass2())).toEqual([42, 43]);
});
test('genAllEnforce rejects all promises if any throw or do not return a value', async () => {
    await expect((0, gen_await_1.genAllEnforce)(pass(), fail())).rejects.toEqual(new index_js_1.default(`promise threw '42' to genEnforce`));
    await expect((0, gen_await_1.genAllEnforce)(pass(), passNull())).rejects.toEqual(new index_js_1.default('promise did not return a value to genEnforce'));
});
test('All functions run in parallel', async () => {
    const start = Date.now();
    await Promise.all([
        (0, gen_await_1.genAll)(passWithTimeout(), passWithTimeout()),
        (0, gen_await_1.genAllNull)(passWithTimeout(), passWithTimeout()),
        (0, gen_await_1.genAllEnforce)(passWithTimeout(), passWithTimeout()),
    ]);
    const time = Date.now() - start;
    expect(Math.abs(time - 100)).toBeLessThan(50);
});
