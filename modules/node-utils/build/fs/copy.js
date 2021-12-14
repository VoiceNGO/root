"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function copy(src, dest, { recursive } = {}) {
    return new Promise((resolve, reject) => {
        const args = recursive ? ['-r'] : [];
        const cp = (0, child_process_1.spawn)('cp', [...args, src, dest]);
        cp.on('close', (code) => {
            if (code) {
                reject(`cp exited with code ${code}`);
            }
            else {
                resolve();
            }
        });
    });
}
exports.default = copy;
