/// <reference types="voice" />
import type { JSONSchemaForNPMPackageJsonFiles } from 'schemas/json-types/package';
import type { JSONSchemaForESLintConfigurationFiles } from 'schemas/json-types/eslintrc';
import type { SchemaForPrettierrc } from 'schemas/json-types/prettierrc';
import type { JSONSchemaForTheTypeScriptCompilerSConfigurationFile } from 'schemas/json-types/tsconfig';
export default function readJsonFile(srcPath: absoluteFilePath, type: 'package.json'): Promise<JSONSchemaForNPMPackageJsonFiles>;
export default function readJsonFile(srcPath: absoluteFilePath, type: 'eslintrc.json'): Promise<JSONSchemaForESLintConfigurationFiles>;
export default function readJsonFile(srcPath: absoluteFilePath, type: 'prettierrc.json'): Promise<SchemaForPrettierrc>;
export default function readJsonFile(srcPath: absoluteFilePath, type: 'tsconfig.json'): Promise<JSONSchemaForTheTypeScriptCompilerSConfigurationFile>;
