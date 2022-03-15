export default class FIFOQueue<T> {
    private head;
    private last;
    private len;
    get length(): number;
    push(item: T): void;
    next(): T | null;
}
//# sourceMappingURL=fifo-queue.d.ts.map