import Err from './err';

type Unpack<T> = T extends Promise<infer U> ? U : T;
type UnpackAll<T> = {
  [P in keyof T]: Unpack<T[P]>;
};
type UnpackAllOrNull<T> = {
  [P in keyof T]: Unpack<T[P]> | null;
};

export async function gen<T>(
  promise: Promise<T> | T
): Promise<[Err, null] | [null, T]> {
  try {
    return [null, await promise];
  } catch (err) {
    const error: Err = err instanceof Err ? err : new Err(err);

    return [error, null];
  }
}

export async function genEnforce<T>(
  promise: Promise<T | undefined | null> | T | undefined | null
): Promise<T> {
  let retVal;

  try {
    retVal = await promise;
  } catch (err) {
    throw new Err(`promise threw '${err}' to genEnforce`, err);
  }

  if (retVal == null) {
    throw new Err('promise did not return a value to genEnforce');
  }

  return retVal;
}

export function genNull<T>(
  promise: Promise<T | undefined | null> | T | undefined | null
): Promise<T | null> {
  return Promise.resolve(promise)
    .then((v) => (v == null ? null : v))
    .catch(() => null);
}

export async function genAll<T extends any[]>(
  ...promises: T
): Promise<[Array<Err | null> | null, UnpackAllOrNull<T>]> {
  const results = await Promise.all([].map.call(promises, gen));
  // @ts-ignore
  const errors = results.map((result) => result[0]);
  // @ts-ignore
  const values = results.map((result) => result[1]);

  // @ts-ignore
  return [errors.filter((v) => v != null).length ? errors : null, values];
}

export function genAllEnforce<T extends any[]>(
  ...promises: T
): Promise<UnpackAll<T>> {
  // @ts-ignore
  return Promise.all([].map.call(promises, genEnforce));
}

export function genAllNull<T extends any[]>(
  ...promises: T
): Promise<UnpackAllOrNull<T>> {
  // @ts-ignore
  return Promise.all([].map.call(promises, genNull));
}
