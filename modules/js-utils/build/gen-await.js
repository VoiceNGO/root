"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAllNull = exports.genAllEnforce = exports.genAll = exports.genNull = exports.genEnforce = exports.gen = void 0;
const tslib_1 = require("tslib");
const index_js_1 = (0, tslib_1.__importDefault)(require("./err/index.js"));
async function gen(promise) {
    try {
        return [null, await promise];
    }
    catch (err) {
        const error = err instanceof index_js_1.default ? err : new index_js_1.default(err);
        return [error, null];
    }
}
exports.gen = gen;
async function genEnforce(promise) {
    let retVal;
    try {
        retVal = await promise;
    }
    catch (err) {
        throw new index_js_1.default(`promise threw '${err}' to genEnforce`, err);
    }
    if (retVal == null) {
        throw new index_js_1.default('promise did not return a value to genEnforce');
    }
    return retVal;
}
exports.genEnforce = genEnforce;
function genNull(promise) {
    return Promise.resolve(promise)
        .then((v) => (v == null ? null : v))
        .catch(() => null);
}
exports.genNull = genNull;
async function genAll(...promises) {
    const results = await Promise.all([].map.call(promises, gen));
    // @ts-ignore
    const errors = results.map((result) => result[0]);
    // @ts-ignore
    const values = results.map((result) => result[1]);
    // @ts-ignore
    return [errors.filter((v) => v != null).length ? errors : null, values];
}
exports.genAll = genAll;
function genAllEnforce(...promises) {
    // @ts-ignore
    return Promise.all([].map.call(promises, genEnforce));
}
exports.genAllEnforce = genAllEnforce;
function genAllNull(...promises) {
    // @ts-ignore
    return Promise.all([].map.call(promises, genNull));
}
exports.genAllNull = genAllNull;
