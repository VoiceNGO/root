/// <reference types="voice" />
import type { JSONSchemaForNPMPackageJsonFiles } from 'schemas/json-types/package';
import type { JSONSchemaForESLintConfigurationFiles } from 'schemas/json-types/eslintrc';
import type { SchemaForPrettierrc } from 'schemas/json-types/prettierrc';
import type { JSONSchemaForTheTypeScriptCompilerSConfigurationFile } from 'schemas/json-types/tsconfig';
export default function readJsonFile(srcFolder: absoluteDirPath, fileName: 'package.json'): Promise<JSONSchemaForNPMPackageJsonFiles>;
export default function readJsonFile(srcFolder: absoluteDirPath, fileName: 'eslintrc.json'): Promise<JSONSchemaForESLintConfigurationFiles>;
export default function readJsonFile(srcFolder: absoluteDirPath, fileName: 'prettierrc.json'): Promise<SchemaForPrettierrc>;
export default function readJsonFile(srcFolder: absoluteDirPath, fileName: 'tsconfig.json'): Promise<JSONSchemaForTheTypeScriptCompilerSConfigurationFile>;
//# sourceMappingURL=read-json-file.d.ts.map