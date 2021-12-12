export default function getConsole() {
    if (typeof console !== 'undefined') {
        return console;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const voidFn = () => { };
    // @ts-expect-error types want Console.Console ... ... ... wtf???
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
