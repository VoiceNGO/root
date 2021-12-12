import { validateConfig } from './program-validate.js';

export interface programConfig<
  T extends Record<string, any> = Record<string, any>
> {
  name: string;
  version?: string;
  sock?: string;
  description?: string | string[];
  example?: string | string[];
  options?: {
    [K in keyof T]: {
      short?: string;
      choices?: (string | number)[];
      required?: boolean;
      variadic?: boolean;
      validator?: () => T[K];
    };
  };
  handler?: (data: T) => void;
  commands?: Program[];
}

function parseSingleCommandArg(arg, argNext) {
  const splitCommand = /^(--?)?([a-z]+)(?:(=)(.+))?$/.exec(arg);
}

class Program {
  commandMap: { [key: string]: Program } = {};

  constructor(private config: programConfig) {
    validateConfig(config);
  }

  get name() {
    return this.config.name;
  }

  // --command
  // --command=foo
  // --command foo
  // -a
  // -abc
  // -abc
  // -a=foo
  // -a foo

  processArgs(argList: string[]) {
    const nestedCommand = (this.config.commands || []).find(
      (command) => command.name === argList[0]
    );
    if (nestedCommand) {
      nestedCommand.processArgs(argList.slice(1));

      return;
    }
  }

  processArgv() {
    // eslint-disable-next-line no-magic-numbers
    const argv = process.argv.slice(2);
    this.processArgs(argv);
  }
}
