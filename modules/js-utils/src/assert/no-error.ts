import Err from '../err/err';

export default function assertNoError(
  err: Optional<Error>,
  errMsgGenerator: () => string,
  ifErrCallback?: Function
) {
  if (err) {
    if (ifErrCallback) ifErrCallback();

    throw new Err(errMsgGenerator(), err);
  }
}
