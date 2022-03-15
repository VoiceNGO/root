import getTwoDotExtension from 'node-utils/fs/get-two-dot-extension';
import { iBuilder, copy, sass, ts } from './file-builders/index.js';
import { stat } from 'fs/promises';
import { genAllEnforce } from 'js-utils/gen-await';

async function srcIsNewerThanBuildFiles(
  builder: iBuilder,
  srcPath: absoluteFilePath
): Promise<boolean> {
  const buildFiles = await builder.getBuildFiles(srcPath);

  const [srcStat, ...buildStats] = await genAllEnforce(
    stat(srcPath),
    ...buildFiles.map((file) => stat(file))
  );

  const olderBuildFiles = buildStats.filter(
    (buildStat) => buildStat.mtime < srcStat.mtime
  );
  const olderFileExists = olderBuildFiles.length > 0;

  return olderFileExists;
}

export default async function buildFile(
  srcPath: absoluteFilePath
): Promise<void> {
  const builder = getBuilder(srcPath);

  if (!builder) {
    const extension = getTwoDotExtension(srcPath);

    console.warn(`No builder available for for file "${srcPath}"`);
    return;
  }

  if (!(await srcIsNewerThanBuildFiles(builder, srcPath))) {
    return;
  }

  builder.buildFile(srcPath);
}

export function getBuilder(srcPath: absoluteFilePath): iBuilder | undefined {
  const matchers: [RegExp, iBuilder][] = [
    [/\.d\.ts$/, copy],
    [/\.link$/, copy],
    [/\.sass$/, sass],
    [/\.[cm]?tsx?$/, ts],
  ];

  const matchedBuilder = matchers.find(([regex]) => regex.test(srcPath));

  return matchedBuilder && matchedBuilder[1];
}
