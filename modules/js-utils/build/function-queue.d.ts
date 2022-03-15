export default class FunctionQueue {
    private maxWorkers;
    private queue;
    private runningWorkers;
    constructor(maxWorkers?: number);
    add(fn: () => any): void;
    dequeue(): void;
}
//# sourceMappingURL=function-queue.d.ts.map