import { levels } from './levels.js';

function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export default class Err extends Error {
  logLevel?: levels;
  static Fatal: typeof Err;

  static printable = (err: Optional<Error>): string => {
    if (!err) return '';

    return `${err.toString()}\t${err.stack || ''}`;
  };

  constructor(msg?: Obj, previousError?: unknown, logLevel?: levels) {
    super(hasOwnProperty(msg, 'message') ? msg.message : msg);

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
