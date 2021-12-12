import Err from './err.js';

const CRITICAL_ERROR_LEVEL = 'crit';

export default class CriticalErr extends Err {
  constructor(msg?: string, previousError?: Error) {
    super(msg, previousError, CRITICAL_ERROR_LEVEL);
  }
}
