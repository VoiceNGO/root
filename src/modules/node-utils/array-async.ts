import Err from './err';
import { genAll } from './gen-await';

type errResponse = Array<Err | null> | null;
const firstError = (errors: errResponse): Err | null =>
  (errors || []).find((n) => Boolean(n)) || null;

export async function every<T>(
  ary: Array<T>,
  cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<unknown>,
  thisArg?: unknown
): Promise<[Err | null, boolean]> {
  const [errors, responses] = await genAll(
    ...ary.map((currentValue: T, index: number) =>
      cb.call(thisArg, currentValue, index, ary)
    )
  );

  return [firstError(errors), responses.every(Boolean)];
}

export async function everyIgnoreErrors<T>(
  ary: Array<T>,
  cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<unknown>,
  thisArg?: unknown
): Promise<boolean> {
  const [, each] = await every(ary, cb, thisArg);

  return each;
}

export async function map<T, U>(
  ary: Array<T>,
  cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<U>,
  thisArg?: unknown
): Promise<[Err | null, Array<U | null>]> {
  const [errors, response] = await genAll(
    ...ary.map((currentValue: T, index: number) =>
      cb.call(thisArg, currentValue, index, ary)
    )
  );
  return [firstError(errors), response];
}

export async function mapIgnoreErrors<T, U>(
  ary: Array<T>,
  cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<U>,
  thisArg?: unknown
): Promise<Array<U | null>> {
  const [, mappedValues] = await map(ary, cb, thisArg);
  return mappedValues;
}

export async function filter<T>(
  ary: Array<T>,
  cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<unknown>,
  thisArg?: unknown
): Promise<[Err | null, Array<T>]> {
  const [errs, filterValues] = await map(ary, cb, thisArg);
  return [errs, ary.filter((val, ix) => filterValues[ix])];
}

export async function filterIgnoreErrors<T>(
  ary: Array<T>,
  cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<unknown>,
  thisArg?: unknown
): Promise<Array<T>> {
  const [, filterValues] = await map(ary, cb, thisArg);
  return ary.filter((val, ix) => filterValues[ix]);
}

export async function forEach<T>(
  ary: Array<T>,
  cb: (value: T, index: number, array: ReadonlyArray<T>) => unknown,
  thisArg?: unknown
): Promise<Err | null> {
  const [errs] = await genAll(
    ...ary.map((currentValue: T, index: number) =>
      cb.call(thisArg, currentValue, index, ary)
    )
  );
  return firstError(errs);
}

export async function forEachIgnoreErrors<T>(
  ary: Array<T>,
  cb: (value: T, index: number, array: ReadonlyArray<T>) => unknown,
  thisArg?: unknown
): Promise<void> {
  await forEach(ary, cb, thisArg);
}

// TODO: write tests for `this`

// reduce
// reduceRight
// find
// findIndex
// some
