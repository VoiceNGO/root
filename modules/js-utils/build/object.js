export function invert(object) {
    const out = {};
    Object.entries(object).forEach(([key, value]) => (out['' + value] = key));
    return out;
}
