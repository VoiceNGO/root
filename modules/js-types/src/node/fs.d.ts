declare module 'fs' {
  export function readdirSync(
    path: PathLike,
    options?:
      | { encoding: BufferEncoding | null; withFileTypes?: false | undefined }
      | BufferEncoding
      | null
  ): fileName[];
}
