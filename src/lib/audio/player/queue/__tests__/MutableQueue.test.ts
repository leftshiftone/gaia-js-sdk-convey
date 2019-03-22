import {Queue} from "../Queue";
import {MutableQueue} from "../MutableQueue";

describe("MutableQueueTest", () => {

    let classUnderTest: Queue<number>;

    beforeEach(() => {
        classUnderTest = new MutableQueue();
    });

    test("is a fifo queue", () => {
        classUnderTest.enqueue(1);
        classUnderTest.enqueue(2);
        classUnderTest.enqueue(3);

        expect(classUnderTest.dequeue()).toBe(1);
        expect(classUnderTest.dequeue()).toBe(2);
        expect(classUnderTest.dequeue()).toBe(3);
    });

    test("isEmpty and size are consistent", () => {
        expect(classUnderTest.isEmpty()).toBeTruthy();
        expect(classUnderTest.size()).toBe(0);
        classUnderTest.enqueue(1);
        expect(classUnderTest.isEmpty()).toBeFalsy();
        expect(classUnderTest.size()).toBe(1);
        classUnderTest.dequeue();
        expect(classUnderTest.isEmpty()).toBeTruthy();
        expect(classUnderTest.size()).toBe(0);
    });
});
