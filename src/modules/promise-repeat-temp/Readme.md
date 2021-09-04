# Promise Repeat

A simple utility that retries a given function until it either succeeds or certain failure criteria are met. It's also useful in case you want to just timeout a Promise.

I wrote this because I couldn't find a small library without dependencies for the purpose of including in a browser environment.

## Installation

```bash
$ npm install promise-repeat
```

## Usage

```ts
somePromiseFunction()
  .then(something )
  .then(promiseRepeat(fn, options))
  .then(...)
  .catch(...)

promiseRepeat(fn, options)() // note the trailing () which kicks-off the chain
  .then(...)
  .catch(...)
```

### Options

<!-- prettier-ignore -->
| Option             | Default          | Description |
| ------------------ | ---------------- | ----------- |
| maxAttempts        | 3                | Maximum number of attempts to make before failing
| maxTimeout         | 3,000 (3 sec)    | Maximum amount of time before the promsie gets rejected
| throttle           | 0                | How long to wait between calls to the function
| throttleFn         | returns throttle | `function( retryCount, throttle )` - Custom throttle function to allow for timing adjustments
| boolRetryFn        | returns true     | `function( err, { retryCount: # })` - Function that should return true or false based on `err` as to whether or not the function should keep trying. Note that this does _not_ override the `maxRetries` or `maxTimeout` options. Set those both to `Infinity` if you want to rely solely on this option.
| resolveAfterReject |                  | If the function returns a value _after_ the promise has been rejected due to a timeout, this is called so that you can actually catch the result (in case you need to roll it back, notify user, etc).  Potentially called once for each attempt at running the promise

If a promise is rejected it is rejected with the last error, with `err.previousErrors = Error[]` added to object
