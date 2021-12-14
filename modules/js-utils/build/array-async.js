"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEachIgnoreErrors = exports.forEach = exports.filterIgnoreErrors = exports.filter = exports.mapIgnoreErrors = exports.map = exports.everyIgnoreErrors = exports.every = void 0;
const gen_await_js_1 = require("./gen-await.js");
const firstError = (errors) => (errors || []).find((n) => Boolean(n)) || null;
async function every(ary, cb, thisArg) {
    const [errors, responses] = await (0, gen_await_js_1.genAll)(...ary.map((currentValue, index) => cb.call(thisArg, currentValue, index, ary)));
    return [firstError(errors), responses.every(Boolean)];
}
exports.every = every;
async function everyIgnoreErrors(ary, cb, thisArg) {
    const [, each] = await every(ary, cb, thisArg);
    return each;
}
exports.everyIgnoreErrors = everyIgnoreErrors;
async function map(ary, cb, thisArg) {
    const [errors, response] = await (0, gen_await_js_1.genAll)(...ary.map((currentValue, index) => cb.call(thisArg, currentValue, index, ary)));
    return [firstError(errors), response];
}
exports.map = map;
async function mapIgnoreErrors(ary, cb, thisArg) {
    const [, mappedValues] = await map(ary, cb, thisArg);
    return mappedValues;
}
exports.mapIgnoreErrors = mapIgnoreErrors;
async function filter(ary, cb, thisArg) {
    const [errs, filterValues] = await map(ary, cb, thisArg);
    return [errs, ary.filter((val, ix) => filterValues[ix])];
}
exports.filter = filter;
async function filterIgnoreErrors(ary, cb, thisArg) {
    const [, filterValues] = await map(ary, cb, thisArg);
    return ary.filter((val, ix) => filterValues[ix]);
}
exports.filterIgnoreErrors = filterIgnoreErrors;
async function forEach(ary, cb, thisArg) {
    const [errs] = await (0, gen_await_js_1.genAll)(...ary.map((currentValue, index) => cb.call(thisArg, currentValue, index, ary)));
    return firstError(errs);
}
exports.forEach = forEach;
async function forEachIgnoreErrors(ary, cb, thisArg) {
    await forEach(ary, cb, thisArg);
}
exports.forEachIgnoreErrors = forEachIgnoreErrors;
// TODO: write tests for `this`
// reduce
// reduceRight
// find
// findIndex
// some
