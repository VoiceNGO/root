import { readFile } from 'fs/promises';
import { parse } from 'path';
import getTSConfig from './get-ts-config.js';
import * as ts from 'typescript';
import srcToBuildPath from './src-to-build-path.js';
export default async function tsBuild(srcPath, options) {
  const fileContents = await readFile(srcPath);
  const transpiled = ts.default.transpileModule(fileContents.toString(), {
    compilerOptions: options,
  });
  console.log({ transpiled });
}
export function getBuildFiles(srcPath, type = 'all') {
  const buildPath = srcToBuildPath(srcPath);
  const parsedBuildPath = parse(buildPath);
  const rootBuildPath = `${parsedBuildPath.dir}/${parsedBuildPath.name}`;
  const jsBuildPath = `${rootBuildPath}.js`;
  const mapBuildPath = `${rootBuildPath}.js`;
  switch (type) {
    case 'js':
      return [jsBuildPath];
    case 'map':
      return [mapBuildPath];
    case 'all':
      return [jsBuildPath, mapBuildPath];
  }
}

tsBuild(
  '/voice/tools/dev-tools/src/app/utils/build-file.ts',
  getTSConfig('/voice/tools/dev-tools/src/app/utils/build-file.ts')
);
