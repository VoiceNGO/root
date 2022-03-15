"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const err_1 = tslib_1.__importDefault(require("../err/err"));
function assertNoError(err, errMsgGenerator, ifErrCallback) {
    if (err) {
        if (ifErrCallback)
            ifErrCallback();
        throw new err_1.default(errMsgGenerator(), err);
    }
}
exports.default = assertNoError;
