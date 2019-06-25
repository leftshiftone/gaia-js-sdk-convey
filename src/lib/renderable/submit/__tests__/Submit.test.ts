import {Submit} from "../index";
import node from "../../../support/node";

describe("SubmitTest", () => {

    it("form data structure", () => {
        [
            {type: "email", value: "nice@test.dev", name: "email"},
            {type: "phone", value: "066412345", name: "phone"},
            {type: "text", value: "some useless text", name: "text"},
        ]
            .forEach(e => {
                const input = node('input');
                const attributes: Attr = {} as Attr;
                input.addAttributes({
                    type: e.type,
                    value: e.value,
                    name: e.name
                });

                const expectAttr: Attr = {} as Attr;
                expectAttr[e.name] = e.value;

                Submit.addInputValuesToAttributes(input.unwrap() as HTMLInputElement, attributes);
                expect(attributes).toEqual(expectAttr)
            })
    })

    it("block data structure", () => {
        [
            {type: "slider", value: 2, name: "slider"},
            {type: "spinner", value: 1, name: "spinner"},
        ]
            .forEach(e => {
                const input = node('input');
                const attributes: Attr = {} as Attr;
                input.addAttributes({
                    type: e.type,
                    value: e.value,
                    name: e.name
                });

                const expectAttr: Attr = {} as Attr;
                expectAttr[e.name] = [e.value];

                Submit.addElementValueToAttributes(input.unwrap() as HTMLInputElement, attributes);
                expect(attributes).toEqual(expectAttr)
            })
    })
});
