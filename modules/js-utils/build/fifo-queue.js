"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FIFOQueue {
    constructor() {
        this.len = 0;
    }
    get length() {
        return this.len;
    }
    push(item) {
        const newItem = { value: item };
        const { last } = this;
        if (last) {
            last.next = newItem;
            this.last = newItem;
        }
        else {
            this.head = this.last = newItem;
        }
        this.len++;
    }
    next() {
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
exports.default = FIFOQueue;
