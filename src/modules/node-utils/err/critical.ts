import Err from './err';

const CRITICAL_ERROR_LEVEL = 'crit';

export default class CriticalErr extends Err {
  constructor(msg?: string, previousError?: Error) {
    super(msg, previousError, CRITICAL_ERROR_LEVEL);
  }
}
