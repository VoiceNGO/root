import { resolve } from 'path';
import { readdir, stat, writeFile, mkdir } from 'fs/promises';

import { Command, Argument } from 'commander';
import voiceFolder from 'node-utils/voice-root';
import copy from 'node-utils/fs/copy';
import exists from 'node-utils/fs/exists';

const templateDir = resolve('./module-templates');
const commandName = 'addModule';

export default async function addModule(program: Command) {
  const files = await readdir(templateDir);
  const moduleTypes = [];
  for (const fileName of files) {
    const filePath = resolve(templateDir, fileName);
    const moduleStat = await stat(filePath);
    if (moduleStat.isDirectory()) {
      moduleTypes.push(fileName);
    }
  }

  program
    .command(commandName)
    .addArgument(new Argument('<type>').choices(moduleTypes))
    .addArgument(new Argument('<name>'))
    .description(
      `Initializes a new module.  type = [${moduleTypes.join(', ')}]`
    )
    .action(async (type, name) => {
      const newModuleFolder = resolve(voiceFolder, 'modules', name);
      const moduleExists = await exists(newModuleFolder);

      if (moduleExists) throw new Error(`${newModuleFolder} already exists`);

      await copy(resolve(templateDir, type), newModuleFolder, {
        recursive: true,
      });
      await createPackageJSON(newModuleFolder, name);
      await mkdir(resolve(newModuleFolder, 'src'));

      console.log(`created ${newModuleFolder}`);
    });
}

async function createPackageJSON(folder: string, moduleName: string) {
  const jsonPath = resolve(folder, 'package.json');
  const jsonData = JSON.stringify(
    {
      name: moduleName,
      version: '0.0.1',
      license: 'UNLICENSED',
      private: true,
      devDependencies: {
        'voice-tools': 'workspace:modules/voice-build-tools',
      },
    },
    null,
    2
  );
  writeFile(jsonPath, jsonData);
}
