#!/usr/bin/env node

import { resolve } from 'path';

import { Command } from 'commander';
import { globby as glob } from 'globby';
import readJsonFile from 'node-utils/fs/read-json-file';

async function main() {
  const { version } = await readJsonFile(resolve('..'), 'package.json');
  const program = new Command();
  program.version(version);

  const files = await glob(resolve(__dirname, './commands/*.js'));

  const commandPromises = files.map((file) => require(file).default(program));
  await Promise.all(commandPromises);

  program.parse(process.argv);
}

main();
