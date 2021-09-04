import assert from 'assert';
import { lstat } from 'fs/promises';
import { isAbsolute } from 'path';
import { genNull } from '../gen-await';

export default async function isFile(nodePath: absolutePath): Promise<boolean> {
  assert(isAbsolute(nodePath), 'non-absolute path passed to isFile');

  const stats = await genNull(lstat(nodePath));

  return Boolean(stats?.isFile());
}
