export function invert(object: Object) {
  const out: { [key: string]: string } = {};
  Object.entries(object).forEach(([key, value]) => (out['' + value] = key));

  return out;
}

export function pick<T, K extends keyof T>(
  source: T,
  ...keys: K[]
): Pick<T, K> {
  const returnValue = {} as Pick<T, K>;

  keys.forEach((k) => {
    returnValue[k] = source[k];
  });

  return returnValue;
}
