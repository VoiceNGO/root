export function replaceLastOccurrence<T extends string>(
  src: T,
  match: string,
  replace: string
): T {
  const lastIndex = src.lastIndexOf(match);
  if (lastIndex < 0) {
    return src;
  }

  return (src.substr(0, lastIndex) +
    replace +
    src.substr(lastIndex + match.length)) as T;
}

export function replaceIfAtStart<T extends string>(
  src: T,
  match: string,
  replace: string
): T {
  if (src.indexOf(match) === 0) {
    return src.replace(match, replace) as T;
  }

  return src;
}

export function startsWithUpperCase(src: string): boolean {
  return /^[A-Z]/.test(src);
}

export function toCamelCase<T extends string>(src: T): T {
  return src
    .replace(/-([a-z])/g, (m1, m2) => m2.toUpperCase())
    .replace(/^([A-Z])/, (m0, m1) => m1.toLowerCase()) as T;
}

export function toPascalCase<T extends string>(src: T): T {
  return src
    .replace(/-([a-z])/g, (m1, m2) => m2.toUpperCase())
    .replace(/^([a-z])/, (m0, m1) => m1.toUpperCase()) as T;
}

export function toDashedCase<T extends string>(src: T): T {
  return src
    .replace(/^([A-Z])/, (m0, m1) => m1.toLowerCase())
    .replace(/([A-Z])/g, (m0, m1) => `-${m1.toLowerCase()}`) as T;
}
