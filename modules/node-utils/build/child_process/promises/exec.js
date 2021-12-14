"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
util_1.promisify;
async function exec(command, options) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, options, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            resolve({ stdout: stdout.toString(), stderr: stderr.toString() });
        });
    });
}
exports.default = exec;
