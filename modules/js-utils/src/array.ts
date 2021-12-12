export function filterInPlace<T>(
  ary: T[],
  condition: (element: T, index: number, array: T[]) => boolean,
  thisArg?: unknown
): T[] {
  let outIndex = 0;

  ary.forEach((element, curIndex) => {
    if (condition.call(thisArg, element, curIndex, ary)) {
      ary[outIndex] = element;
      outIndex++;
    }
  });

  ary.length = outIndex;

  return ary;
}
