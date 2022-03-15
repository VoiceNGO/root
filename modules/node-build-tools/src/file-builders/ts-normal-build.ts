/*
TODO:

Currently this builds many more files than we need to as the createCompilerHost/createProgram/program.emit method of
building a file builds every imported file along with it.  Figure out how to build just the one file.

We can just build the one file by using:

ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }});

But I can't figure out how to generate the .d.ts file other than by building everything.  This might be possible with
an incremental watcher, but then we'd have two watchers in a race condition since this file is called from a watcher

documentation: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

also see: https://github.com/swc-project/swc/issues/657 for a possible pending solution
*/

import { parse, resolve } from 'path';

import { genAllEnforce } from 'js-utils/gen-await';
import { default as ts, ModuleResolutionKind } from 'typescript';

import getTSConfig from '../build-utils/get-ts-config.js';
import srcToBuildPath from '../build-utils/src-to-build-path.js';
import { JSONSchemaForTheTypeScriptCompilerSConfigurationFile } from 'schemas/json-types/tsconfig';

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

function remapCompilerOptions(
  options: JSONSchemaForTheTypeScriptCompilerSConfigurationFile
): void {
  const remapEnums = { moduleResolution: ModuleResolutionKind };
  Object.entries(remapEnums).forEach(([key, value]) => {
    if (options.hasOwnProperty(key)) {
      options[key] = mapStringToEnumValue(options[key] as string, value);
    }
  });
}

export async function buildFile(
  srcPath: absoluteFilePath
): Promise<Record<absoluteFilePath, string>> {
  const [tsConfig, [jsBuildPath, definitionBuildPath]] = await genAllEnforce(
    getTSConfig(srcPath),
    getBuildFiles(srcPath)
  );

  const { compilerOptions } = tsConfig;
  const { dir: srcDir } = parse(srcPath);

  // some of the options don't accept the strings that are in the tsconfig.json files and need to be re-mapped to enums
  remapCompilerOptions(compilerOptions);

  const createdFiles: Record<string, string> = {};
  const host = ts.createCompilerHost(compilerOptions);
  host.writeFile = (fileName: string, contents: string) =>
    (createdFiles[fileName] = contents);

  const program = ts.createProgram([srcPath], compilerOptions, host);
  program.emit();

  [jsBuildPath, definitionBuildPath].forEach((file) => {
    if (!createdFiles[file]) {
      throw new Error(`${file} was not built`);
    }
  });

  return {
    [resolve(srcDir, jsBuildPath)]: createdFiles[jsBuildPath]!,
    [resolve(srcDir, definitionBuildPath)]: createdFiles[definitionBuildPath]!,
  };
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
