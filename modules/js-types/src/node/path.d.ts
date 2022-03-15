type parseResults = {
  root: string;
  base: string;
  ext: string;
  name: string;
};

declare module 'path' {
  export interface PlatformPath {
    normalize(path: absolutePath): absolutePath;
    normalize(path: string): relativePath;
    // prettier-ignore
    join<T extends string[]>(p1: absolutePath, ...args: T): Last<T> extends fileName ? absoluteFilePath : Last<T> extends dirName ? absoluteDirPath : absolutePath;
    // prettier-ignore
    join<T extends string[]>(p1: relativePath, ...args: T): Last<T> extends fileName ? relativeFilePath : Last<T> extends dirName ? relativeDirPath : relativePath;
    join(...parts: string[]): relativePath;
    resolve(...parts: string[]): absolutePath;
    relative(from: string, to: string): relativePath;
    dirname(path: absolutePath): absoluteDirPath;
    dirname(path: string): relativeDirPath;
    basename(path: string): fileName;
    parse(path: absolutePath): parseResults & { dir: absoluteDirPath };
    parse(path: string): parseResults & { dir: relativeDirPath };
  }
}
