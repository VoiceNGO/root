type QueueItem<T> = { next?: QueueItem<T>; value: T };

export default class FIFOQueue<T> {
  private head: QueueItem<T> | undefined;
  private last: QueueItem<T> | undefined;
  private len = 0;

  get length() {
    return this.len;
  }

  push(item: T) {
    const newItem: QueueItem<T> = { value: item };
    const { last } = this;

    if (last) {
      last.next = newItem;
      this.last = newItem;
    } else {
      this.head = this.last = newItem;
    }

    this.len++;
  }

  next(): T | null {
    const { head, last } = this;

    if (head) {
      this.head = head.next;

      if (head === last) {
        this.last = undefined;
      }

      return head.value;
    }

    this.len--;
    return null;
  }
}
