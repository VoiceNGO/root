import Err from './err.js';
export default class CriticalErr extends Err {
    constructor(msg?: string, previousError?: Error);
}
