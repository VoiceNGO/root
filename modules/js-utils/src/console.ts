export default function getConsole(
  consoleRef: Console | null = console
): Omit<typeof console, 'Console'> {
  if (consoleRef != null) {
    return consoleRef;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const voidFn = (): void => {};

  return {
    log: voidFn,
    assert: voidFn,
    clear: voidFn,
    count: voidFn,
    countReset: voidFn,
    debug: voidFn,
    dir: voidFn,
    dirxml: voidFn,
    error: voidFn,
    group: voidFn,
    groupCollapsed: voidFn,
    groupEnd: voidFn,
    info: voidFn,
    table: voidFn,
    time: voidFn,
    timeEnd: voidFn,
    timeLog: voidFn,
    trace: voidFn,
    warn: voidFn,
    profile: voidFn,
    profileEnd: voidFn,
    timeStamp: voidFn,
  };
}
