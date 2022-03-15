import { join } from 'path';
import { globby } from 'globby';
import generatedFileHeader from './generated-file-header';
import Err from 'js-utils/err/err';
import { writeFile, readFile } from 'fs/promises';
import exists from 'node-utils/fs/exists';

export default async function updateDTSIndex(
  srcFolder: absoluteDirPath
): Promise<void> {
  const indexFileName = join(srcFolder, 'index.d.ts' as fileName);

  if (!(await okayToReplaceIndex(indexFileName))) {
    throw new Err(
      `Cowardly refusing to overwrite non-generated index file at ${indexFileName}`
    );
  }

  const indexContents = await genDTSIndexContents(srcFolder);

  await writeFile(indexFileName, indexContents);
}

async function okayToReplaceIndex(
  indexFileName: absoluteFilePath
): Promise<boolean> {
  const indexExists = await exists(indexFileName);

  if (!indexExists) return true;

  const indexContents = await readFile(indexFileName);
  const foundFileHeader = indexContents.indexOf(generatedFileHeader) >= 0;

  return foundFileHeader;
}

async function genDTSIndexContents(
  srcFolder: absoluteDirPath
): Promise<string> {
  const dtsGlob = `${srcFolder}/**/*.d.ts`;
  const dtsFiles = await globby(dtsGlob);

  return (
    generatedFileHeader +
    dtsFiles.map((filePath) => `/// <reference path="${filePath}" />\n`)
  );
}
