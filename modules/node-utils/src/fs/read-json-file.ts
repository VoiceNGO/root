import { readFile } from 'fs/promises';
import isObject from 'js-utils/is-object';

import type { JSONSchemaForNPMPackageJsonFiles } from 'schemas/json-types/package';
import type { JSONSchemaForESLintConfigurationFiles } from 'schemas/json-types/eslintrc';
import type { SchemaForPrettierrc } from 'schemas/json-types/prettierrc';
import type { JSONSchemaForTheTypeScriptCompilerSConfigurationFile } from 'schemas/json-types/tsconfig';

export default async function readJsonFile(
  srcPath: absoluteFilePath,
  type: 'package.json'
): Promise<JSONSchemaForNPMPackageJsonFiles>;
export default async function readJsonFile(
  srcPath: absoluteFilePath,
  type: 'eslintrc.json'
): Promise<JSONSchemaForESLintConfigurationFiles>;
export default async function readJsonFile(
  srcPath: absoluteFilePath,
  type: 'prettierrc.json'
): Promise<SchemaForPrettierrc>;
export default async function readJsonFile(
  srcPath: absoluteFilePath,
  type: 'tsconfig.json'
): Promise<JSONSchemaForTheTypeScriptCompilerSConfigurationFile>;
export default async function readJsonFile(
  srcPath: absoluteFilePath
): Promise<jsonObject> {
  const fileContents = await readFile(srcPath);
  try {
    const json = JSON.parse(fileContents.toString());

    if (!isObject(json)) {
      throw new Error(`Unexpected contents of JSON file: ${srcPath}`);
    }

    return json;
  } catch {
    throw new Error(`Failed to parse JSON: ${srcPath}`);
  }
}
