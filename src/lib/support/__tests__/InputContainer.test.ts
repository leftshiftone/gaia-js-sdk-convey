import node from "../node";
import {InputContainer} from "../InputContainer";

describe("InputContainer test", () => {

    it("form data structure", () => {
        [
            {type: "email", value: "nice@test.dev", name: "email"},
            {type: "text", value: "some useless text", name: "text"},
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

                InputContainer.addValuesToAttributes(input.unwrap() as HTMLInputElement, attributes);
                expect(attributes).toEqual(expectAttr)
            })
    });

    it("getAll", () => {
        [
            [`<div class="lto-trigger" value="value" name="val"/>`, {"val": ["value"]}],
            [`<div class="lto-drop-area" value="value" name="val"/>`, {"val": ["value"]}],
            [`<div class="lto-code-reader" value="value" name="val"/>`, {"val": ["value"]}],
            [`<div class="lto-camera" value="value" name="val"/>`, {"val": ["value"]}],
            [`<textarea class="lto-textarea" value="value" name="val"/>`, {"val": ["value"]}],
            [`<input class="lto-slider" type="range" value="3" name="val"/>`, {"val": [3]}],
            [`<input class="lto-spinner" type="number" value="4" name="val"/>`, {"val": [4]}],
            [`<input class="lto-textInput" type="text" value="value" name="val"/>`, {"val": ["value"]}],
            [`<input class="lto-email" type="email" value="email@mail.com" name="val"/>`, {"val": ["email@mail.com"]}],
        ].forEach(element => {
            const form = document.createElement("form") as HTMLFormElement;
            form.innerHTML = element[0] as string;
            InputContainer.getAll(form).then(attr => {
                expect(attr).toEqual(element[1])
            })
        })
    })
});
