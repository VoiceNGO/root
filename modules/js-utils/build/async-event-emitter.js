"use strict";
var _EventEmitter_instances, _a, _EventEmitter_defaultMaxListeners, _EventEmitter_maxListeners, _EventEmitter_listeners, _EventEmitter_getListenerArray, _EventEmitter_push, _EventEmitter_validateMaxListeners;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DEFAULT_MAX_LISTENERS = 10;
class EventEmitter {
    constructor() {
        _EventEmitter_instances.add(this);
        _EventEmitter_maxListeners.set(this, void 0);
        _EventEmitter_listeners.set(this, {});
    }
    static get defaultMaxListeners() {
        return tslib_1.__classPrivateFieldGet(this, _a, "f", _EventEmitter_defaultMaxListeners);
    }
    static set defaultMaxListeners(n) {
        if (typeof n !== 'number' || n < 1) {
            throw new RangeError(`defaultMaxListeners must be at least 1.  Tried to set ${n}`);
        }
        tslib_1.__classPrivateFieldSet(this, _a, n, "f", _EventEmitter_defaultMaxListeners);
    }
    addListener(...data) {
        return this.on(...data);
    }
    async emit(...args) {
        await this.emitAndGetData(...args);
    }
    emitAndGetData(eventName, ...data) {
        const events = tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_getListenerArray).call(this, eventName);
        tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventName] = events.filter(({ once }) => !once);
        const mappedResponses = events.map(({ callback, scope }) => new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(callback.call(scope, ...data));
            }, 0);
        }));
        return Promise.all(mappedResponses);
    }
    getEventNames() {
        return Object.keys(tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f"));
    }
    getMaxListeners() {
        return tslib_1.__classPrivateFieldGet(this, _EventEmitter_maxListeners, "f") || tslib_1.__classPrivateFieldGet(EventEmitter, _a, "f", _EventEmitter_defaultMaxListeners);
    }
    getListenerCount(eventName) {
        return tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_getListenerArray).call(this, eventName).length;
    }
    getListeners(eventName) {
        return tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_getListenerArray).call(this, eventName).map((listener) => listener.callback);
    }
    off(eventName, callback) {
        const events = tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_getListenerArray).call(this, eventName);
        tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventName] = events.filter(({ callback: eventCallback }) => callback !== eventCallback);
        return this;
    }
    on(eventName, callback, scope) {
        return tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_push).call(this, eventName, { callback, scope });
    }
    once(eventName, callback, scope) {
        return tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_push).call(this, eventName, { once: true, callback, scope });
    }
    removeAllListeners(eventName) {
        if (eventName) {
            tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventName] = [];
        }
        else {
            tslib_1.__classPrivateFieldSet(this, _EventEmitter_listeners, {}, "f");
        }
        return this;
    }
    removeListener(...args) {
        return this.off(...args);
    }
    setMaxListeners(n) {
        tslib_1.__classPrivateFieldSet(this, _EventEmitter_maxListeners, n, "f");
        return this;
    }
}
_a = EventEmitter, _EventEmitter_maxListeners = new WeakMap(), _EventEmitter_listeners = new WeakMap(), _EventEmitter_instances = new WeakSet(), _EventEmitter_getListenerArray = function _EventEmitter_getListenerArray(eventName) {
    return tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventName] || (tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventName] = []);
}, _EventEmitter_push = function _EventEmitter_push(eventName, listener) {
    const events = tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_getListenerArray).call(this, eventName);
    events.push(listener);
    tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_validateMaxListeners).call(this, eventName);
    return this;
}, _EventEmitter_validateMaxListeners = function _EventEmitter_validateMaxListeners(eventName) {
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
};
_EventEmitter_defaultMaxListeners = { value: DEFAULT_MAX_LISTENERS };
exports.default = EventEmitter;
