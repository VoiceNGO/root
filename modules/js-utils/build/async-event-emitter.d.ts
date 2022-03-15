declare type eventName = string | symbol;
declare type Callback = (...data: unknown[]) => unknown;
declare type onFnParams = Parameters<EventEmitter['on']>;
declare type offFnParams = Parameters<EventEmitter['off']>;
declare class EventEmitter {
    #private;
    static get defaultMaxListeners(): number;
    static set defaultMaxListeners(n: number);
    addListener(...data: onFnParams): EventEmitter;
    emit(...args: Parameters<EventEmitter['emitAndGetData']>): Promise<void>;
    emitAndGetData(eventName: eventName, ...data: unknown[]): Promise<unknown[]>;
    getEventNames(): eventName[];
    getMaxListeners(): number;
    getListenerCount(eventName: eventName): number;
    getListeners(eventName: eventName): Callback[];
    off(eventName: eventName, callback: Callback): EventEmitter;
    on(eventName: eventName, callback: Callback, scope?: unknown): EventEmitter;
    once(eventName: eventName, callback: Callback, scope?: unknown): EventEmitter;
    removeAllListeners(eventName?: eventName): EventEmitter;
    removeListener(...args: offFnParams): EventEmitter;
    setMaxListeners(n: number): EventEmitter;
}
export default EventEmitter;
//# sourceMappingURL=async-event-emitter.d.ts.map