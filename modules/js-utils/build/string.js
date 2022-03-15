"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebabCase = exports.toPascalCase = exports.toCamelCase = exports.startsWithUpperCase = exports.replaceIfAtStart = exports.replaceLastOccurrence = void 0;
function replaceLastOccurrence(src, match, replace) {
    const lastIndex = src.lastIndexOf(match);
    if (lastIndex < 0) {
        return src;
    }
    return (src.substr(0, lastIndex) +
        replace +
        src.substr(lastIndex + match.length));
}
exports.replaceLastOccurrence = replaceLastOccurrence;
function replaceIfAtStart(src, match, replace) {
    if (src.indexOf(match) === 0) {
        return src.replace(match, replace);
    }
    return src;
}
exports.replaceIfAtStart = replaceIfAtStart;
function startsWithUpperCase(src) {
    return /^[A-Z]/.test(src);
}
exports.startsWithUpperCase = startsWithUpperCase;
function toCamelCase(src) {
    return src
        .replace(/-([a-z])/g, (m1, m2) => m2.toUpperCase())
        .replace(/^([A-Z])/, (m0, m1) => m1.toLowerCase());
}
exports.toCamelCase = toCamelCase;
function toPascalCase(src) {
    return src
        .replace(/-([a-z])/g, (m1, m2) => m2.toUpperCase())
        .replace(/^([a-z])/, (m0, m1) => m1.toUpperCase());
}
exports.toPascalCase = toPascalCase;
function toKebabCase(src) {
    return src
        .replace(/^([A-Z])/, (m0, m1) => m1.toLowerCase())
        .replace(/([A-Z])/g, (m0, m1) => `-${m1.toLowerCase()}`);
}
exports.toKebabCase = toKebabCase;
