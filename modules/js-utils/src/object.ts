export function invert(object: Object) {
  const out: { [key: string]: string } = {};
  Object.entries(object).forEach(([key, value]) => (out['' + value] = key));

  return out;
}
