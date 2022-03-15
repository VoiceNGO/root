"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const err_1 = (0, tslib_1.__importDefault)(require("js-utils/err/err"));
class ParallelQueue {
    constructor(maxWorkers = 10) {
        this.maxWorkers = maxWorkers;
        this.queue = [];
        this.runningWorkers = 0;
    }
    addToQueue(fn) {
        this.queue.push(fn);
        this.dequeue();
    }
    dequeue() {
        while (this.runningWorkers < this.maxWorkers && this.queue.length > 0) {
            const fnToRun = this.queue.shift();
            this.runningWorkers++;
            Promise.resolve()
                .then(fnToRun)
                .finally(() => {
                this.runningWorkers--;
            })
                .then(() => {
                this.dequeue();
            })
                .catch((err) => {
                throw new err_1.default('Queued function failed', err);
            });
        }
    }
}
exports.default = ParallelQueue;
