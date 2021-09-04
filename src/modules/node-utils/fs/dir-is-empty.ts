import assert from 'assert';
import { readdir } from 'fs/promises';
import { isAbsolute } from 'path';

import isDirectory from './is-directory';

export default async function dirIsEmpty(
  nodePath: absolutePath
): Promise<boolean> {
  assert(isAbsolute(nodePath), 'non-absolute path passed to dirIsEmpty');

  const fileIsDirectory = await isDirectory(nodePath);
  assert(fileIsDirectory, `dirIsEmpty called on non-directory ${nodePath}`);

  const dirContents = await readdir(nodePath);

  return Boolean(dirContents) && dirContents.length === 0;
}
