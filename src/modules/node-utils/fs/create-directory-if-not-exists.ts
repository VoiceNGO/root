import assert from 'assert';
import { mkdir } from 'fs/promises';
import { isAbsolute } from 'path';

import { exists } from '.';

export default async function createDirectoryIfNotExists(
  dirPath: absolutePath
): Promise<void> {
  assert(
    isAbsolute(dirPath),
    'non-absolute path passed to createDirectoryIfNotExists'
  );

  const dirExists = await exists(dirPath);
  const ERR_CODE_EXISTS = 'EEXIST';

  if (!dirExists) {
    try {
      await mkdir(dirPath);
    } catch (err) {
      // It is technically possible that this directory was created after the above `exists` check in situations like
      // async creating a bunch of files/directories.  So ignore the EEXIST error since it has no effect
      if (
        err instanceof Error &&
        (err as SystemError).code !== ERR_CODE_EXISTS
      ) {
        throw err;
      }
    }
  }
}
