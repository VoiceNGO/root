import { levels } from './levels';

export default class Err extends Error {
  logLevel?: levels;
  static Fatal: typeof Err;

  static printable = (err: Optional<Error>): string => {
    if (!err) return '';

    return `${err.toString()}\t${err.stack || ''}`;
  };

  constructor(msg?: string, previousError?: unknown, logLevel?: levels) {
    super(msg);

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
