"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const async_event_emitter_1 = tslib_1.__importDefault(require("../async-event-emitter"));
let events;
let cb1;
let cb2;
beforeEach(() => {
    events = new async_event_emitter_1.default();
    cb1 = jest.fn();
    cb2 = jest.fn();
});
describe('emit', () => {
    beforeEach(() => {
        events.on('ev', cb1);
    });
    test('does not immediately trigger event', () => {
        expect(cb1).not.toHaveBeenCalled();
    });
    test('triggers events', async () => {
        await events.emit('ev');
        expect(cb1).toHaveBeenCalled();
    });
    test('triggers events each time', async () => {
        await events.emit('ev');
        await events.emit('ev');
        await events.emit('ev');
        await events.emit('ev');
        expect(cb1).toHaveBeenCalledTimes(4);
    });
    test('events run asynchronously', () => {
        events.emit('ev');
        expect(cb1).not.toHaveBeenCalled();
    });
    test('multiple callbacks get called', async () => {
        events.on('ev', cb2);
        await events.emit('ev');
        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });
});
describe('emitAndGetData', () => {
    beforeEach(() => {
        events.on('ev', cb1);
    });
    test('passes through data', async () => {
        await events.emit('ev', 42);
        expect(cb1).toHaveBeenCalledWith(42);
    });
});
describe('once', () => {
    beforeEach(() => {
        events.once('ev', cb1);
    });
    test('emits', async () => {
        await events.emit('ev');
        expect(cb1).toHaveBeenCalled();
    });
    test('unbinds after first emit', async () => {
        await events.emit('ev');
        await events.emit('ev');
        expect(cb1).toHaveBeenCalledTimes(1);
    });
});
describe('off', () => {
    test('unsubscribes', async () => {
        events.on('ev', cb1);
        events.off('ev', cb1);
        await events.emit('ev');
        expect(cb1).not.toHaveBeenCalled();
    });
    test('updates subscription count', () => {
        events.on('ev', cb1);
        events.off('ev', cb1);
        expect(events.getListenerCount('ev')).toBe(0);
    });
});
describe('util methods', () => {
    test('getEventNames', () => {
        events.on('ev1', cb1);
        events.on('ev2', cb1);
        expect(events.getEventNames()).toEqual(['ev1', 'ev2']);
    });
    test('getListeners', () => {
        events.on('ev', cb1);
        events.on('ev', cb2);
        expect(events.getListeners('ev')).toEqual([cb1, cb2]);
    });
    test('getListenerCount', () => {
        events.on('ev', cb1);
        events.on('ev', cb2);
        expect(events.getListenerCount('ev')).toBe(2);
    });
});
