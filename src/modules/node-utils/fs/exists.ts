import assert from 'assert';
import { lstat } from 'fs/promises';
import { isAbsolute } from 'path';
import { genNull } from '@modules/node-utils/gen-await';

export default async function exists(nodePath: absolutePath): Promise<boolean> {
  assert(isAbsolute(nodePath), 'non-absolute path passed to exists');

  const stat = await genNull(lstat(nodePath));

  return Boolean(stat);
}
