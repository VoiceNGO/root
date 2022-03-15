"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getConsole(consoleRef = console) {
    if (consoleRef != null) {
        return consoleRef;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const voidFn = () => { };
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
exports.default = getConsole;
