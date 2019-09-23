import {Queue} from "./Queue";

/**
 * Unbounded queue backed by a mutable javascript array.
 */
export class MutableQueue<T> implements Queue<T> {

    private readonly queue: T[] = [];

    dequeue(): T {
        if (this.queue.length === 0) {
            throw new Error("Queue is empty");
        }
        const dequeued = this.queue.pop();
        if (dequeued === undefined) {
            throw new Error("dequeued item was undefined");
        }
        return dequeued;
    }

    enqueue(item: T): void {
        this.queue.unshift(item);
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    size(): number {
        return this.queue.length;
    }
}
