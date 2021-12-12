declare module 'globby' {
  import { Options as GlobOptions, Entry } from 'fast-glob';

  export function globby(
    patterns: string | readonly string[],
    options?: GlobOptions
  ): Promise<relativeFilePath[]>;
}
