"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const err_1 = tslib_1.__importDefault(require("../err"));
test('should accept strings', () => {
    const err = new err_1.default('foo');
    expect(err.message).toEqual('foo');
});
test('should accept numbers', () => {
    const err = new err_1.default(42);
    expect(err.message).toEqual('42');
});
test('should accept other Err instances', () => {
    const err = new err_1.default(new err_1.default('foo'));
    expect(err.message).toEqual('foo');
});
test('should accept Error instances', () => {
    const err = new err_1.default(new Error('foo'));
    expect(err.message).toEqual('foo');
});
test('should accept and keep log levels', () => {
    expect(new err_1.default('foo', null, 'info').logLevel).toBe('info');
    expect(new err_1.default('foo', null, 'warn').logLevel).toBe('warn');
    expect(new err_1.default('foo', null, 'emerg').logLevel).toBe('emerg');
});
