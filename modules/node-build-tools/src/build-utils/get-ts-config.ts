import { exec } from 'node-utils/child_process/promises';
import path from 'path';
import { JSONSchemaForTheTypeScriptCompilerSConfigurationFile } from 'schemas/json-types/tsconfig';
import { CompilerOptions } from 'typescript';

export default async function getTSConfig(
  srcFile: absoluteFilePath
): Promise<JSONSchemaForTheTypeScriptCompilerSConfigurationFile> {
  const cwd = path.dirname(srcFile);

  const { stdout, stderr } = await exec('yarn tsc --showConfig', { cwd });

  if (stderr) {
    return {};
  }

  try {
    return JSON.parse(stdout) as CompilerOptions;
  } catch {
    throw new Error(`Error parsing JSON for tsc output in ${cwd}`);
  }
}
