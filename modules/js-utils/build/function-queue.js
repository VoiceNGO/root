"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const err_1 = tslib_1.__importDefault(require("js-utils/err/err"));
const fifo_queue_1 = tslib_1.__importDefault(require("./fifo-queue"));
class FunctionQueue {
    constructor(maxWorkers = 1) {
        this.maxWorkers = maxWorkers;
        this.queue = new fifo_queue_1.default();
        this.runningWorkers = 0;
    }
    add(fn) {
        this.queue.push(fn);
        this.dequeue();
    }
    dequeue() {
        while (this.runningWorkers < this.maxWorkers && this.queue.length > 0) {
            const fnToRun = this.queue.next();
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
exports.default = FunctionQueue;
