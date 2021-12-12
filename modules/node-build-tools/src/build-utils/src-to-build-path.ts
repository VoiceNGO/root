export default function srcToBuildPath<T extends fileOrDirPath>(srcPath: T): T {
  // replaces only the last occurance of `src/`
  return srcPath.replace(/\bsrc\/(?!.*\bsrc\/)/, `build/`) as T;
}
