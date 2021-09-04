/* eslint-disable */
import expect from 'expect';
import promiseRepeat from '../index';

const RESOLVE = 'success';
const REJECT = 'reject';

let resolveMock: jest.Mock;
let rejectMock: jest.Mock;

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function genResolveAfterMs(ms = 0): Promise<string> {
  await wait(ms);
  resolveMock();
  return RESOLVE;
}

async function genRejectAfterMs(ms = 0): Promise<string> {
  await wait(ms);
  rejectMock();
  throw REJECT;
}

function genNRejectsThenResolve(
  numRejects: number,
  rejectionInterval = 0,
  resolveDelay = 0
) {
  let rejections = 0;
  return () => {
    if (rejections >= numRejects) {
      return genResolveAfterMs(resolveDelay);
    }

    rejections++;

    return genRejectAfterMs(rejectionInterval);
  };
}

beforeEach(() => {
  resolveMock = jest.fn();
  rejectMock = jest.fn();
});

test('resolves normally', async () => {
  const repeater = promiseRepeat(() => genResolveAfterMs());
  const response = await repeater();
  expect(response).toBe(RESOLVE);
});

test('passes arguments through to function', async () => {
  const mockFn = jest.fn();
  await promiseRepeat(mockFn)(123, 456);
  expect(mockFn).toHaveBeenCalledWith(123, 456);
});

test('retries', async () => {
  const repeater = promiseRepeat(genNRejectsThenResolve(2));
  const response = await repeater();

  expect(response).toBe(RESOLVE);
  expect(rejectMock).toHaveBeenCalledTimes(2);
});

test('fails after N rejections', async () => {
  const repeater = promiseRepeat(genNRejectsThenResolve(3));
  let err;
  try {
    await repeater();
  } catch (e) {
    err = e;
  }
  expect(err).toEqual(new Error(REJECT));
  expect(rejectMock).toHaveBeenCalledTimes(3);
});

test('repeatedly passes arguments through to function', async () => {
  const mockFn = jest.fn();
  await promiseRepeat(mockFn)(123, 456);
  expect(mockFn).toHaveBeenCalledWith(123, 456);
});

test('times out', async () => {
  const repeater = promiseRepeat(() => genResolveAfterMs(50), { timeoutMs: 5 });
  let err;

  try {
    await repeater();
  } catch (e) {
    err = e;
  }

  expect(err).toBeInstanceOf(Error);
});

test('passes after timeouts', async () => {
  const repeater = promiseRepeat(genNRejectsThenResolve(2, 50), {
    timeoutMs: 5,
  });

  const result = await repeater();

  expect(result).toBe(RESOLVE);
});

test('resolve after reject is called for each failure', async () => {
  const afterRejectMockFn = jest.fn();
  const repeater = promiseRepeat(() => genResolveAfterMs(10), {
    timeoutMs: 1,
    maxAttempts: 3,
    resolveAfterReject: afterRejectMockFn,
  });

  try {
    await repeater();
  } catch {}
  await wait(50);

  expect(afterRejectMockFn).toHaveBeenCalledWith(RESOLVE);
  expect(afterRejectMockFn).toHaveBeenCalledTimes(3);
});
