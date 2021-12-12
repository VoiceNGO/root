import Err from './err/index.js';
export async function gen(promise) {
    try {
        return [null, await promise];
    }
    catch (err) {
        const error = err instanceof Err ? err : new Err(err);
        return [error, null];
    }
}
export async function genEnforce(promise) {
    let retVal;
    try {
        retVal = await promise;
    }
    catch (err) {
        throw new Err(`promise threw '${err}' to genEnforce`, err);
    }
    if (retVal == null) {
        throw new Err('promise did not return a value to genEnforce');
    }
    return retVal;
}
export function genNull(promise) {
    return Promise.resolve(promise)
        .then((v) => (v == null ? null : v))
        .catch(() => null);
}
export async function genAll(...promises) {
    const results = await Promise.all([].map.call(promises, gen));
    // @ts-ignore
    const errors = results.map((result) => result[0]);
    // @ts-ignore
    const values = results.map((result) => result[1]);
    // @ts-ignore
    return [errors.filter((v) => v != null).length ? errors : null, values];
}
export function genAllEnforce(...promises) {
    // @ts-ignore
    return Promise.all([].map.call(promises, genEnforce));
}
export function genAllNull(...promises) {
    // @ts-ignore
    return Promise.all([].map.call(promises, genNull));
}
