declare namespace Unique {
  const Opaque: unique symbol;
  const FileName: unique symbol;
  const DirName: unique symbol;
  const FileContents: unique symbol;
  const AbsolutePath: unique symbol;
  const AbsoluteFilePath: unique symbol;
  const AbsoluteDirPath: unique symbol;
  const RelativePath: unique symbol;
  const RelativeFilePath: unique symbol;
  const RelativeDirPath: unique symbol;
}

type Opaque<A, B extends symbol> = A & { readonly [Unique.Opaque]: B };

type Optional<T> = T | null | undefined;

type fileName = Opaque<string, typeof Unique.FileName>;
type dirName = Opaque<string, typeof Unique.DirName>;
type fileContents = Opaque<string, typeof Unique.FileContents>;
type absolutePath =
  | Opaque<string, typeof Unique.AbsolutePath>
  | absoluteFilePath
  | absoluteDirPath;
type absoluteFilePath = Opaque<string, typeof Unique.AbsoluteFilePath>;
type absoluteDirPath = Opaque<string, typeof Unique.AbsoluteDirPath>;
type relativePath =
  | Opaque<string, typeof Unique.RelativePath>
  | relativeFilePath
  | relativeDirPath;
type relativeFilePath = Opaque<string, typeof Unique.RelativeFilePath>;
type relativeDirPath = Opaque<string, typeof Unique.RelativeDirPath>;

type fsNodeName = fileName | dirName;
type fsNodePath = relativePath | absolutePath;

type filePath = absoluteFilePath | relativeFilePath;
type dirPath = absoluteDirPath | relativeDirPath;

type fileNameOrPath = fileName | filePath;
type dirNameOrPath = dirName | dirPath;

type fileOrDirPath = filePath | dirPath;
