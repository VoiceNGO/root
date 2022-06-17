import { parse } from 'path';

import srcToBuildPath from '../build-utils/src-to-build-path';

export async function buildFile(
  srcPath: absoluteFilePath
): Promise<Record<absoluteFilePath, Buffer>> {
  return {};
}

export async function getBuildFiles(
  srcPath: absoluteFilePath
): Promise<absoluteFilePath[]> {
  const buildPath = srcToBuildPath(srcPath);
  const parsedBuildPath = parse(buildPath);
  const cssBuildPath =
    `${parsedBuildPath.dir}/${parsedBuildPath.name}.css` as absoluteFilePath;

  return [cssBuildPath];
}
