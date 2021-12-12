import { readFile } from 'fs/promises';
import { parse } from 'path';

import { genAllEnforce } from 'js-utils/gen-await';
import {
  default as ts,
  EnumDeclaration,
  EnumMember,
  EnumType,
  ModuleResolutionKind,
} from 'typescript';

import getTSConfig from '../build-utils/get-ts-config.js';
import srcToBuildPath from '../build-utils/src-to-build-path.js';

function mapStringToEnumValue<T extends Obj>(
  keyToMap: string,
  enumMap: T
): T[keyof T] {
  for (const [key, value] of Object.entries(enumMap)) {
    if (key.toLowerCase() === keyToMap.toLowerCase()) {
      return value as T[keyof T];
    }
  }

  throw new Error(`Key ${keyToMap} not found in enum`);
}

export async function buildFile(srcPath: absoluteFilePath) {
  const [fileContents, tsConfig, [jsBuildPath, definitionBuildPath]] =
    await genAllEnforce(
      readFile(srcPath),
      getTSConfig(srcPath),
      getBuildFiles(srcPath)
    );

  const { compilerOptions } = tsConfig;

  // const transpiled = ts.transpileModule(fileContents.toString(), {
  //   compilerOptions: tsConfig,
  // });
  const host = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram([srcPath], compilerOptions, host);
  program.emit();

  // return { [jsBuildPath]: transpiled };
}

export async function getBuildFiles(
  srcPath: absoluteFilePath
): Promise<Double<absoluteFilePath>> {
  const buildPath = srcToBuildPath(srcPath);
  const parsedBuildPath = parse(buildPath);
  const rootBuildPath = `${parsedBuildPath.dir}/${parsedBuildPath.name}`;
  const jsBuildPath = `${rootBuildPath}.js` as absoluteFilePath;
  const definitionBuildPath = `${rootBuildPath}.d.ts` as absoluteFilePath;
  // const mapBuildPath = `${rootBuildPath}.map` as absoluteFilePath;

  return [jsBuildPath, definitionBuildPath];
}
