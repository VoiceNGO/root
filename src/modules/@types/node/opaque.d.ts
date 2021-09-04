namespace Unique {
  export declare const Opaque: unique symbol;
  export declare const FileName: unique symbol;
  export declare const DirName: unique symbol;
  export declare const AbsolutePath: unique symbol;
  export declare const RelativePath: unique symbol;
}

type Opaque<A, B extends symbol> = A & { readonly [Unique.Opaque]: B };

type Optional<T> = T | null | undefined;

type fileName = Opaque<string, typeof Unique.FileName>;
type dirName = Opaque<string, typeof Unique.DirName>;
type absolutePath = Opaque<string, typeof Unique.AbsolutePath>;
type relativePath = Opaque<string, typeof Unique.RelativePath>;

type fsNodeName = fileName | dirName;
type fsNodePath = relativePath | absolutePath;
