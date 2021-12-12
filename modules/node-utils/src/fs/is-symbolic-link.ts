import assert from 'assert';
import { lstat } from 'fs/promises';
import { isAbsolute } from 'path';
import { genNull } from 'js-utils/gen-await';

export default async function isSymbolicLink(
  nodePath: absolutePath
): Promise<boolean> {
  assert(isAbsolute(nodePath), 'non-absolute path passed to isSymbolicLink');

  const stats = await genNull(lstat(nodePath));

  return Boolean(stats?.isSymbolicLink());
}
