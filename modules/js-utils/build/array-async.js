import { genAll } from './gen-await.js';
const firstError = (errors) => (errors || []).find((n) => Boolean(n)) || null;
export async function every(ary, cb, thisArg) {
    const [errors, responses] = await genAll(...ary.map((currentValue, index) => cb.call(thisArg, currentValue, index, ary)));
    return [firstError(errors), responses.every(Boolean)];
}
export async function everyIgnoreErrors(ary, cb, thisArg) {
    const [, each] = await every(ary, cb, thisArg);
    return each;
}
export async function map(ary, cb, thisArg) {
    const [errors, response] = await genAll(...ary.map((currentValue, index) => cb.call(thisArg, currentValue, index, ary)));
    return [firstError(errors), response];
}
export async function mapIgnoreErrors(ary, cb, thisArg) {
    const [, mappedValues] = await map(ary, cb, thisArg);
    return mappedValues;
}
export async function filter(ary, cb, thisArg) {
    const [errs, filterValues] = await map(ary, cb, thisArg);
    return [errs, ary.filter((val, ix) => filterValues[ix])];
}
export async function filterIgnoreErrors(ary, cb, thisArg) {
    const [, filterValues] = await map(ary, cb, thisArg);
    return ary.filter((val, ix) => filterValues[ix]);
}
export async function forEach(ary, cb, thisArg) {
    const [errs] = await genAll(...ary.map((currentValue, index) => cb.call(thisArg, currentValue, index, ary)));
    return firstError(errs);
}
export async function forEachIgnoreErrors(ary, cb, thisArg) {
    await forEach(ary, cb, thisArg);
}
// TODO: write tests for `this`
// reduce
// reduceRight
// find
// findIndex
// some
