import assert from 'assert';
import path, { isAbsolute } from 'path';

import { createDirectoryIfNotExists, pathToFolderNameArray } from './index.js';

export default async function mkdirp(dirPath: absolutePath): Promise<void> {
  assert(isAbsolute(dirPath), 'non-absolute path passed to mkdirp');

  // include '' as 'root' so that paths start with  / since we're only working with absolute paths here
  const folderNames = ['' as dirName, ...pathToFolderNameArray(dirPath)];

  for (let i = 1, l = folderNames.length; i < l; i++) {
    const partialDir = folderNames
      .slice(0, i + 1)
      .join(path.sep) as absolutePath;

    // eslint-disable-next-line no-await-in-loop -- it's necessary for mkdirp
    await createDirectoryIfNotExists(partialDir);
  }
}
