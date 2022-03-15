"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const critical_1 = tslib_1.__importDefault(require("../critical"));
test('should create errors with critical level', () => {
    expect(new critical_1.default('foo').logLevel).toEqual('crit');
});
