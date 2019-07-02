// noinspection TsLint
import wrap from '../node';
import * as  sinon from 'sinon';
import node from "../node";

describe('NodeTest', () => {

    it('wrap() creates instance', () => {
        const classUnderTest = wrap({} as any);
        expect(classUnderTest).not.toBeUndefined();
    });

    it('wrap() calls document.createElement() if called with string argument', () => {
        const classUnderTest = wrap('abc');

        expect(classUnderTest).not.toBeUndefined();
        expect(document.getElementsByTagName('abc')).not.toBeUndefined();
    });

    it('addAttributes()', () => {
        const node = { setAttribute: () => undefined };
        const spy = sinon.spy(node, 'setAttribute');
        const classUnderTest = wrap(node as any);

        classUnderTest.addAttributes({
            a : 1,
            b : 2,
        });

        expect(spy.calledTwice).toBeTruthy();
    });

    it("removeAttributes()", () => {
        const n = node("div");
        n.addAttributes({
            test: "abc",
            x: "y",
            y: "x"
        });
        n.removeAttributes("x", "y");

        expect(n.getAttribute("x")).toBeNull();
        expect(n.getAttribute("y")).toBeNull();
    });

    it("getAttribute()", () => {
        const n = node("div");
        n.addAttributes({
            test: "abc",
            x: "y",
            y: "x"
        });
        expect(n.getAttribute("x")).toBe("y");
        expect(n.getAttribute("x")).toBe("y");
    });

    it("addDataAttributes()", () => {
        const mocked = { dataset: {}};
        const node = wrap(mocked as HTMLElement);
        node.addDataAttributes({
            test: "abc",
            x: "y"
        });
        expect(mocked.dataset["test"]).toBe("abc");
        expect(mocked.dataset["x"]).toBe("y");
    });

    it('addClasses()', () => {
        const node = { classList: { add: (str: string) => undefined } };
        const spy = sinon.spy(node.classList, 'add');
        const classUnderTest = wrap(node as  any);

        classUnderTest.addClasses('a', 'b', 'c');

        // @ts-ignore
        expect(spy.withArgs('a').calledOnce).toBeTruthy();
        // @ts-ignore
        expect(spy.withArgs('b').calledOnce).toBeTruthy();
        // @ts-ignore
        expect(spy.withArgs('c').calledOnce).toBeTruthy();
    });

    it('removeClasses() containsClass()', () => {
        const n = node("div");
        n.addClasses("a", "b", "c");
        n.removeClasses("a", "b");
        expect(n.containsClass("a")).toBeFalsy();
        expect(n.containsClass("b")).toBeFalsy();
    });

    it('appendChild(node: Node)', () => {
        const node = { appendChild: () => undefined, unwrap: () => undefined };
        const spy = sinon.spy(node, 'appendChild');

        const classUnderTest = wrap(node as any);

        classUnderTest.appendChild(node as any);

        // @ts-ignore
        expect(spy.calledOnce).toBeTruthy();
    });

    it('appendChild(str: string)', () => {
        const node = { appendChild: () => undefined };
        const spy = sinon.spy(node, 'appendChild');

        const classUnderTest = wrap(node as any);

        classUnderTest.appendChild('abcd');

        // @ts-ignore
        expect(spy.calledOnce).toBeTruthy();
    });

    [
        //contains, remove, add
        [true, true, false],
        [false, false, true],
    ].forEach((triplet: boolean[]) => {
        it('toggleClass()', () => {
            // @formatter:off
            const node = { classList: {
                add: () => undefined,
                contains: (str: string) => undefined,
                remove: (str: string) => undefined} };
            // @formatter:on

            const addSpy = sinon.spy(node.classList, 'add');
            const removeSpy = sinon.spy(node.classList, 'remove');
            const containsStub = sinon.stub(node.classList, 'contains');

            // @ts-ignore
            containsStub.withArgs('xyz').returns(triplet[0]);
            const classUnderTest = wrap(node as  any);

            classUnderTest.toggleClass('xyz');

            expect(removeSpy.calledOnce).toBe(triplet[1]);
            expect(addSpy.calledOnce).toBe(triplet[2]);

        });
    });

    it('onClick() adds event listener', () => {
        const node = { addEventListener: (e: MouseEvent) => undefined };
        const addEventListenerSpy = sinon.spy(node, 'addEventListener');

        const classUnderTest = wrap(node as any);

        classUnderTest.onClick((e => undefined));

        expect(addEventListenerSpy.calledOnce).toBeTruthy();
    });

    it('setStyle()', () => {
        const n = node("div");
        n.setStyle({fontFamily: "Arial", fontSize: "13px"});
        expect(n.unwrap().style.fontSize).toBe("13px");
        expect(n.unwrap().style.fontFamily).toBe("Arial");
    });

});
