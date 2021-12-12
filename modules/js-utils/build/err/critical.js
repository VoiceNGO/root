import Err from './err.js';
const CRITICAL_ERROR_LEVEL = 'crit';
export default class CriticalErr extends Err {
    constructor(msg, previousError) {
        super(msg, previousError, CRITICAL_ERROR_LEVEL);
    }
}
