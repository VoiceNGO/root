export default function isObject(
  obj: unknown
): obj is Record<string | symbol, unknown> {
  // @ts-expect-error
  return !!obj && obj.constructor === Object;
}
