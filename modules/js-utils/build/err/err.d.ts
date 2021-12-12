/// <reference types="voice" />
import { levels } from './levels.js';
export default class Err extends Error {
    logLevel?: levels;
    static Fatal: typeof Err;
    static printable: (err: Optional<Error>) => string;
    constructor(msg?: unknown, previousError?: unknown, logLevel?: levels);
}
