export default function srcToBuildPath(srcPath) {
    // replaces only the last occurance of `src/`
    return srcPath.replace(/\bsrc\/(?!.*\bsrc\/)/, `build/`);
}
