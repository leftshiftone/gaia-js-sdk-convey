/**
 * Generic Queue interface
 */
export interface Queue<T> {
    enqueue(item: T): void;

    dequeue(): T;

    isEmpty(): boolean;

    size(): number;
}
