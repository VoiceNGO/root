export default function isObject(obj) {
    // @ts-expect-error
    return !!obj && obj.constructor === Object;
}
