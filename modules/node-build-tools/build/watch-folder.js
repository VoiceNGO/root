"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fb_watchman_1 = (0, tslib_1.__importDefault)(require("fb-watchman"));
const voice_root_1 = (0, tslib_1.__importDefault)(require("node-utils/voice-root"));
const client = new fb_watchman_1.default.Client();
client.capabilityCheck({ optional: [], required: ['relative_root'] }, (err, resp) => {
    if (err) {
        return;
    }
    client.command(['watch-project', voice_root_1.default], (cmdErr, cmdResp) => {
        if (cmdErr) {
            return;
        }
    });
});
console.log(42);
