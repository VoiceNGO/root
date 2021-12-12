import { join, parse } from 'path';

import { globby as glob } from 'globby';
import srcToBuildPath from './src-to-build-path.js';
import readJsonFile from 'node-utils/fs/read-json-file';
import writeJsonFile from 'node-utils/fs/write-json-file';
import { genAllEnforce } from 'js-utils/gen-await';

const packageJSONFileName = 'package.json' as fileName & 'package.json';

export async function getFolderMapping(
  projectFolder: absoluteDirPath,
  filesToInclude?: relativeFilePath[]
): Promise<Record<string, string>> {
  const srcGlob = 'src/**/*.ts';
  const files =
    filesToInclude ||
    (await glob(srcGlob, {
      cwd: projectFolder,
      ignore: ['**/__tests__/**'],
    }));
  const folderMappings: Record<string, string> = {};

  files.forEach((filePath) => {
    const parsedFile = parse(filePath);
    const isIndex = parsedFile.base === 'index.ts';
    const buildDir = srcToBuildPath(parsedFile.dir);
    const dirWithoutSrc = parsedFile.dir.replace(/\bsrc\//, '/');
    if (isIndex) {
      folderMappings[`./${dirWithoutSrc}`] = `./${buildDir}/index.js`;
    } else {
      folderMappings[
        `./${dirWithoutSrc}/${parsedFile.name}`
      ] = `./${buildDir}/${parsedFile.base}`;
    }
  });

  return folderMappings;
}

export async function getUpdatedJson(
  projectFolder: absoluteDirPath
): Promise<json> {
  const packageJsonSrc = join(projectFolder, packageJSONFileName);
  const [folderMappings, packageJson] = await genAllEnforce(
    getFolderMapping(projectFolder),
    readJsonFile(packageJsonSrc, packageJSONFileName)
  );
  packageJson.exports = folderMappings;

  return packageJson;
}

export default async function updatePackageJsonExports(
  projectFolder: absoluteDirPath
) {
  const packageJsonSrc = join(projectFolder, packageJSONFileName);
  const updatedJson = await getUpdatedJson(projectFolder);
  writeJsonFile(packageJsonSrc, updatedJson);
}
