import Err from 'js-utils/err/err';
import FIFOQueue from './fifo-queue';

export default class FunctionQueue {
  private queue = new FIFOQueue<() => any>();
  private runningWorkers = 0;
  constructor(private maxWorkers = 1) {}

  add(fn: () => any): void {
    this.queue.push(fn);
    this.dequeue();
  }

  dequeue(): void {
    while (this.runningWorkers < this.maxWorkers && this.queue.length > 0) {
      const fnToRun = this.queue.next()!;
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
          throw new Err('Queued function failed', err);
        });
    }
  }
}
