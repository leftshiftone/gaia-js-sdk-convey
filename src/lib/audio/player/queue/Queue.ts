/**
 * Generic Queue interface
 *
 * @author benjamin.krenn@leftshift.one
 * @since 1.0.0
 */
export interface Queue<T> {
    enqueue(item: T): void;

    dequeue(): T;

    isEmpty(): boolean;

    size(): number;
}
