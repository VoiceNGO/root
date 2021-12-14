"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const err_js_1 = (0, tslib_1.__importDefault)(require("./err.js"));
const CRITICAL_ERROR_LEVEL = 'crit';
class CriticalErr extends err_js_1.default {
    constructor(msg, previousError) {
        super(msg, previousError, CRITICAL_ERROR_LEVEL);
    }
}
exports.default = CriticalErr;
