import { unlink } from 'fs/promises';
import { extname } from 'path';
import isFrontendTS from './build-utils/is-frontend-ts.js';
import isServiceDefinition from './build-utils/is-service-definition.js';

import { getBuildFiles as getServiceBuildFiles } from './file-builders/ts-service-build.js';
import { getBuildFiles as getSassBuildFiles } from './file-builders/sass-build.js';
import { SupportedExtensions } from './enums/supported-extensions.js';
import { getBuildFiles as getTSBuildFiles } from './file-builders/ts-build.js';
import Err from 'js-utils/err/err';

async function getFilesToDelete(
  srcPath: absoluteFilePath,
  ext: SupportedExtensions
): Promise<absoluteFilePath[]> {
  switch (ext) {
    case SupportedExtensions.sass:
      return getSassBuildFiles(srcPath);

    case SupportedExtensions.ts:
    case SupportedExtensions.tsx:
      if (isFrontendTS(srcPath)) {
        throw new Err('Not Yet Implemented');
      } else {
        if (await isServiceDefinition(srcPath)) {
          return getServiceBuildFiles(srcPath);
        } else {
          return getTSBuildFiles(srcPath);
        }
      }
  }
}

export default async function deletedFile(srcPath: absoluteFilePath) {
  const ext = extname(srcPath);
  let filesToDelete =
    ext in SupportedExtensions
      ? await getFilesToDelete(srcPath, ext as SupportedExtensions)
      : [];

  const deletePromises = filesToDelete.map(unlink);

  await Promise.all(deletePromises);

  filesToDelete.forEach((filePath) => console.log(`deleted ${filePath}`));
}
