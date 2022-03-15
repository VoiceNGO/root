export type iBuilder = {
  buildFile: (
    srcPath: absoluteFilePath
  ) => Promise<Record<absoluteFilePath, Buffer | string>>;

  getBuildFiles: (srcPath: absoluteFilePath) => Promise<[absoluteFilePath]>;
};

import * as importCopy from './copy-build';
import * as importSass from './sass-build';
import * as importTs from './ts-build';

const [copy, sass, ts] = [importCopy, importSass, importTs] as Triple<iBuilder>;

export { copy, sass, ts };
