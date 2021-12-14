"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriticalErr = void 0;
const tslib_1 = require("tslib");
const err_js_1 = (0, tslib_1.__importDefault)(require("./err.js"));
const critical_js_1 = (0, tslib_1.__importDefault)(require("./critical.js"));
exports.CriticalErr = critical_js_1.default;
exports.default = err_js_1.default;
