export default class ParallelQueue {
    private maxWorkers;
    private queue;
    private runningWorkers;
    constructor(maxWorkers?: number);
    addToQueue(fn: () => any): void;
    dequeue(): void;
}
