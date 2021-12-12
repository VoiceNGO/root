export function replaceLastOccurrence(src, match, replace) {
    const lastIndex = src.lastIndexOf(match);
    if (lastIndex < 0) {
        return src;
    }
    return (src.substr(0, lastIndex) +
        replace +
        src.substr(lastIndex + match.length));
}
export function replaceIfAtStart(src, match, replace) {
    if (src.indexOf(match) === 0) {
        return src.replace(match, replace);
    }
    return src;
}
export function startsWithUpperCase(src) {
    return /^[A-Z]/.test(src);
}
export function toCamelCase(src) {
    return src
        .replace(/-([a-z])/g, (m1, m2) => m2.toUpperCase())
        .replace(/^([A-Z])/, (m0, m1) => m1.toLowerCase());
}
export function toPascalCase(src) {
    return src
        .replace(/-([a-z])/g, (m1, m2) => m2.toUpperCase())
        .replace(/^([a-z])/, (m0, m1) => m1.toUpperCase());
}
export function toDashedCase(src) {
    return src
        .replace(/^([A-Z])/, (m0, m1) => m1.toLowerCase())
        .replace(/([A-Z])/g, (m0, m1) => `-${m1.toLowerCase()}`);
}
