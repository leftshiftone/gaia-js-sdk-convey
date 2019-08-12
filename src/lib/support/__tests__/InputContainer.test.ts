import node from "../node";
import {InputContainer} from "../InputContainer";

describe("InputContainer test", () => {

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

                InputContainer.addInputValuesToAttributes(input.unwrap() as HTMLInputElement, attributes);
                expect(attributes).toEqual(expectAttr)
            })
    });

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

                InputContainer.addElementValueToAttributes(input.unwrap() as HTMLInputElement, attributes);
                expect(attributes).toEqual(expectAttr)
            })
    })

    it("getAll", () => {
        [
            [`<input class="lto-slider" type="range" value="3" name="val"/>`, {"val": ["3"]}],
        ].forEach(element => {
            const form = document.createElement("form") as HTMLFormElement;
            form.innerHTML = element[1] as string;
            InputContainer.getAll(form).then(attr => {
                expect(attr).toBe(element[1])
            })
        })
    })
});
