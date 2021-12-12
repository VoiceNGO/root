export default class Err extends Error {
    constructor(msg, previousError, logLevel) {
        const msgIsValidType = typeof msg === 'string' ||
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
Err.printable = (err) => {
    if (!err)
        return '';
    return `${err.toString()}\t${err.stack || ''}`;
};
