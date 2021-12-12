import { levels } from './levels.js';

export default class Err extends Error {
  logLevel?: levels;
  static Fatal: typeof Err;

  static printable = (err: Optional<Error>): string => {
    if (!err) return '';

    return `${err.toString()}\t${err.stack || ''}`;
  };

  constructor(msg?: unknown, previousError?: unknown, logLevel?: levels) {
    const msgIsValidType =
      typeof msg === 'string' ||
      (typeof msg === 'object' && msg?.constructor === Error);
    super(msgIsValidType ? msg : undefined);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    if (previousError instanceof Error) {
      this.stack += `\n ${previousError.stack}`;
    }

    if (logLevel) {
      this.logLevel = logLevel;
    }
  }
}
