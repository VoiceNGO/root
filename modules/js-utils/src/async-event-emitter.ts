type eventName = string | symbol;
const DEFAULT_MAX_LISTENERS = 10;
type Callback = (...data: unknown[]) => unknown;
type listenerObject = {
  once?: boolean;
  callback: Callback;
  scope?: unknown;
};
type onFnParams = Parameters<EventEmitter['on']>;
type offFnParams = Parameters<EventEmitter['off']>;

class EventEmitter {
  static #defaultMaxListeners = DEFAULT_MAX_LISTENERS;
  static get defaultMaxListeners(): number {
    return this.#defaultMaxListeners;
  }

  static set defaultMaxListeners(n: number) {
    if (typeof n !== 'number' || n < 1) {
      throw new RangeError(
        `defaultMaxListeners must be at least 1.  Tried to set ${n}`
      );
    }

    this.#defaultMaxListeners = n;
  }

  #maxListeners?: number;
  #listeners: Record<eventName, listenerObject[]> = {};

  #getListenerArray(eventName: eventName): listenerObject[] {
    return this.#listeners[eventName] || (this.#listeners[eventName] = []);
  }

  #push(eventName: eventName, listener: listenerObject): EventEmitter {
    const events = this.#getListenerArray(eventName);
    events.push(listener);
    this.#validateMaxListeners(eventName);

    return this;
  }

  #validateMaxListeners(eventName: eventName): void {
    // const maxListeners = this.getMaxListeners();
    // const eventListenerCount = this.getListenerCount(eventName);
    // const eventDisplayName =
    //   typeof eventName === 'symbol'
    //     ? eventName.description || 'Symbol'
    //     : eventName;
    //
    // if (eventListenerCount > maxListeners) {
    //   logger.warn(
    //     `${eventListenerCount} listeners added to event ${eventDisplayName} which is more than the allowed maximum ` +
    //       `of ${maxListeners}`
    //   );
    // }
  }

  addListener(...data: onFnParams): EventEmitter {
    return this.on(...data);
  }

  async emit(
    ...args: Parameters<EventEmitter['emitAndGetData']>
  ): Promise<void> {
    await this.emitAndGetData(...args);
  }

  emitAndGetData(eventName: eventName, ...data: unknown[]): Promise<unknown[]> {
    const events = this.#getListenerArray(eventName);

    this.#listeners[eventName] = events.filter(({ once }) => !once);

    const mappedResponses = events.map(
      ({ callback, scope }) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(callback.call(scope, ...data));
          }, 0);
        })
    );

    return Promise.all(mappedResponses);
  }

  getEventNames(): eventName[] {
    return Object.keys(this.#listeners);
  }

  getMaxListeners(): number {
    return this.#maxListeners || EventEmitter.#defaultMaxListeners;
  }

  getListenerCount(eventName: eventName): number {
    return this.#getListenerArray(eventName).length;
  }

  getListeners(eventName: eventName): Callback[] {
    return this.#getListenerArray(eventName).map(
      (listener) => listener.callback
    );
  }

  off(eventName: eventName, callback: Callback): EventEmitter {
    const events = this.#getListenerArray(eventName);

    this.#listeners[eventName] = events.filter(
      ({ callback: eventCallback }) => callback !== eventCallback
    );

    return this;
  }

  on(eventName: eventName, callback: Callback, scope?: unknown): EventEmitter {
    return this.#push(eventName, { callback, scope });
  }

  once(
    eventName: eventName,
    callback: Callback,
    scope?: unknown
  ): EventEmitter {
    return this.#push(eventName, { once: true, callback, scope });
  }

  removeAllListeners(eventName?: eventName): EventEmitter {
    if (eventName) {
      this.#listeners[eventName] = [];
    } else {
      this.#listeners = {};
    }

    return this;
  }

  removeListener(...args: offFnParams): EventEmitter {
    return this.off(...args);
  }

  setMaxListeners(n: number): EventEmitter {
    this.#maxListeners = n;

    return this;
  }
}

export default EventEmitter;
