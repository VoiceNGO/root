"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceRoot = void 0;
const path_1 = require("path");
const voiceRootProjectName = 'voice-npo';
function voiceRoot(dir = (0, path_1.resolve)('.')) {
    const jsonPath = (0, path_1.resolve)(dir, 'package.json');
    try {
        const packageJson = require(jsonPath);
        if (packageJson.name === voiceRootProjectName)
            return dir;
    }
    catch (err) { }
    const upDir = (0, path_1.resolve)(dir, '..');
    if (upDir !== dir) {
        return voiceRoot(upDir);
    }
    throw new Error('Must be run from within the VoiceNPO root');
}
exports.voiceRoot = voiceRoot;
exports.default = voiceRoot();
