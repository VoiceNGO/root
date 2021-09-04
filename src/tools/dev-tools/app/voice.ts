#!/usr/bin/env node

import { resolve } from 'path';

import { Command } from 'commander';
import glob from 'globby';
import { version } from '../package.json';

async function main() {
  const program = new Command();
  program.version(version);

  const files = await glob(resolve(__dirname, './commands/*.js'));

  for (const commandFile of files) {
    await require(commandFile).default(program);
  }

  program.parse(process.argv);
}

main();
