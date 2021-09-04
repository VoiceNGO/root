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
    join(part1: absolutePath, ...parts: string[]): absolutePath;
    join(...parts: string[]): relativePath;
    resolve(...parts: string[]): absolutePath;
    relative(from: string, to: string): relativePath;
    dirname(path: absolutePath): absolutePath;
    dirname(path: string): relativePath;
    basename(path: string): fileName;
    parse(path: absoutePath): parseResults & { dir: absolutePath };
    parse(path: string): parseResults & { dir: relativePath };
  }
}
