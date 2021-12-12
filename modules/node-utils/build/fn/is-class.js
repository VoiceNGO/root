// eslint-disable-next-line @typescript-eslint/ban-types -- The entire point is that this accepts any function!
export default function isClass(f) {
    return /^class /.test(f.toString());
}
