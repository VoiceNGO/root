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
    join(p1: absolutePath, p2: fileName): absoluteFilePath;
    join(p1: absolutePath, p2: string, p3: fileName): absoluteFilePath;
    join(
      p1: absolutePath,
      p2: string,
      p3: string,
      p4: fileName
    ): absoluteFilePath;
    join(
      p1: absolutePath,
      p2: string,
      p3: string,
      p4: string,
      p5: fileName
    ): absoluteFilePath;
    join(p1: absolutePath, ...parts: string[]): absolutePath;
    join(p1: relativePath, p2: fileName): relativeFilePath;
    join(p1: relativePath, p2: string, p3: fileName): relativeFilePath;
    join(
      p1: relativePath,
      p2: string,
      p3: string,
      p4: fileName
    ): relativeFilePath;
    join(
      p1: relativePath,
      p2: string,
      pe: string,
      p4: string,
      p5: fileName
    ): relativeFilePath;
    resolve(...parts: string[]): absolutePath;
    relative(from: string, to: string): relativePath;
    join(...parts: string[]): relativePath;
    dirname(path: absolutePath): absoluteDirPath;
    dirname(path: string): relativeDirPath;
    basename(path: string): fileName;
    parse(path: absolutePath): parseResults & { dir: absoluteDirPath };
    parse(path: string): parseResults & { dir: relativeDirPath };
  }
}
