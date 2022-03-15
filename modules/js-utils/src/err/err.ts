import { levels } from './levels.js';

export default class Err extends Error {
  logLevel?: levels;

  static printable = (err: Optional<Error>): string => {
    if (!err) return '';

    return `${err.toString()}\t${err.stack || ''}`;
  };

  constructor(msg?: unknown, previousError?: unknown, logLevel?: levels) {
    super(
      // @ts-expect-error -- telling TS that msg.message is an optional string is just annoying
      {}.hasOwnProperty.call(msg, 'message') ? msg.message : msg
    );

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
