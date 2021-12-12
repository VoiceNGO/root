"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultOptions = {
    maxAttempts: 3,
    timeoutMs: 3000,
    throttleMs: 0,
    throttleFn: (retryCount, throttleMs) => throttleMs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldRetryFn: (err, retryCount) => true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    resolveAfterReject: (result) => { },
};
// Note -- Not a "safe" delay function since it can execute immediately,
//   i.e. it might not be pushed onto the end of the call stack.
//
// This behavior is desired in this case since we're using it only within a Promise
function delay(ms) {
    return new Promise((resolve) => {
        if (ms > 0) {
            setTimeout(resolve, ms);
        }
        else {
            resolve();
        }
    });
}
class ErrorWithPreviousErrors extends Error {
    constructor(err, previousErrors) {
        super(err instanceof Error
            ? err.message
            : typeof err === 'string'
                ? err
                : 'Unknown Error');
        this.previousErrors = previousErrors;
        if (err instanceof Error) {
            Error.captureStackTrace(err, err.constructor);
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
function retryPromise(fn, options = {}) {
    const config = { ...defaultOptions, ...options };
    const { maxAttempts, timeoutMs, throttleMs, throttleFn, shouldRetryFn, resolveAfterReject, } = config;
    return (...args) => {
        return new Promise((resolve, reject) => {
            const rejections = [];
            let retryCount = 0;
            let rejected = false;
            async function errHandler(err) {
                const retryCountExceeded = retryCount >= maxAttempts - 1;
                const shouldRetry = !retryCountExceeded && shouldRetryFn(err, retryCount);
                if (shouldRetry) {
                    retryCount++;
                    rejections.push(err);
                    const throttleTime = throttleFn(retryCount, throttleMs);
                    await delay(throttleTime);
                    run();
                }
                else {
                    rejected = true;
                    const rejectionErr = new ErrorWithPreviousErrors(err, rejections);
                    reject(rejectionErr);
                }
            }
            function run() {
                const fnPromise = Promise.resolve().then(() => fn(...args));
                fnPromise
                    .then((result) => {
                    if (rejected) {
                        resolveAfterReject(result);
                    }
                })
                    // eslint-disable-next-line @typescript-eslint/no-empty-function -- don't care about any error here, it's caught below.  We just care that it doesn't end up uncaught
                    .catch(() => { });
                return Promise.race([fnPromise, deferReject()])
                    .then(resolve)
                    .catch(errHandler);
            }
            // reject if fn (or subsequent call) is taking too long
            async function deferReject() {
                await delay(timeoutMs);
                throw new Error(`PromiseRepeat: Promise failed to resolve after ${timeoutMs}ms.`);
            }
            run();
        });
    };
}
exports.default = retryPromise;
