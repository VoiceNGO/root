const defaultOptions = {
  maxAttempts: 3,
  timeoutMs: 3000,
  throttleMs: 0,
  throttleFn: (retryCount: number, throttleMs: number) => throttleMs,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldRetryFn: (err: unknown, retryCount: number) => true,

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  resolveAfterReject: (result: unknown) => {},
};

// Note -- Not a "safe" delay function since it can execute immediately,
//   i.e. it might not be pushed onto the end of the call stack.
//
// This behavior is desired in this case since we're using it only within a Promise
function delay(ms: number) {
  return new Promise<void>((resolve) => {
    if (ms > 0) {
      setTimeout(resolve, ms);
    } else {
      resolve();
    }
  });
}

class ErrorWithPreviousErrors extends Error {
  constructor(err: unknown, public previousErrors: unknown[]) {
    super(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : 'Unknown Error'
    );

    if (err instanceof Error) {
      Error.captureStackTrace(err, err.constructor);
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default function retryPromise<PromiseResult, Args>(
  fn: (...args: Args[]) => Promise<PromiseResult>,
  options: {
    maxAttempts?: number;
    timeoutMs?: number;
    throttleMs?: number;
    throttleFn?: (retryCount: number, throttleMs: number) => number;
    shouldRetryFn?: (err: unknown, retryCount: number) => boolean;
    resolveAfterReject?: (result: PromiseResult) => void;
  } = {}
): (...args: Args[]) => Promise<PromiseResult> {
  const config = { ...defaultOptions, ...options };
  const {
    maxAttempts,
    timeoutMs,
    throttleMs,
    throttleFn,
    shouldRetryFn,
    resolveAfterReject,
  } = config;

  return (...args: Args[]) => {
    return new Promise<PromiseResult>((resolve, reject) => {
      const rejections: unknown[] = [];
      let retryCount = 0;
      let rejected = false;

      async function errHandler(err: unknown) {
        const retryCountExceeded = retryCount >= maxAttempts - 1;
        const shouldRetry =
          !retryCountExceeded && shouldRetryFn(err, retryCount);

        if (shouldRetry) {
          retryCount++;
          rejections.push(err);
          const throttleTime = throttleFn(retryCount, throttleMs);
          await delay(throttleTime);
          run();
        } else {
          rejected = true;
          const rejectionErr = new ErrorWithPreviousErrors(err, rejections);
          reject(rejectionErr);
        }
      }

      function run() {
        const fnPromise = Promise.resolve().then(() => fn(...args));

        fnPromise
          .then((result: PromiseResult) => {
            if (rejected) {
              resolveAfterReject(result);
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-empty-function -- don't care about any error here, it's caught below.  We just care that it doesn't end up uncaught
          .catch(() => {});

        return Promise.race([fnPromise, deferReject()])
          .then(resolve)
          .catch(errHandler);
      }

      // reject if fn (or subsequent call) is taking too long
      async function deferReject(): Promise<PromiseResult> {
        await delay(timeoutMs);

        throw new Error(
          `PromiseRepeat: Promise failed to resolve after ${timeoutMs}ms.`
        );
      }

      run();
    });
  };
}
