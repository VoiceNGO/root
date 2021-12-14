"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Err extends Error {
    constructor(msg, previousError, logLevel) {
        super(msg?.message || msg);
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
exports.default = Err;
Err.printable = (err) => {
    if (!err)
        return '';
    return `${err.toString()}\t${err.stack || ''}`;
};
