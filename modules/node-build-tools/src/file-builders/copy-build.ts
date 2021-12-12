import { readFile } from 'fs/promises';

import srcToBuildPath from '../build-utils/src-to-build-path';

export async function buildFile(
  srcPath: absoluteFilePath
): Promise<Record<absoluteFilePath, Buffer>> {
  const buildPath = (await getBuildFiles(srcPath))[0];
  const fileContents = await readFile(srcPath);

  return { [buildPath]: fileContents };
}

export async function getBuildFiles(
  srcPath: absoluteFilePath
): Promise<[absoluteFilePath]> {
  const buildPath = srcToBuildPath(srcPath);

  return [buildPath];
}
