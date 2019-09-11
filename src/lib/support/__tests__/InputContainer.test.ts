import node from "../node";
import {InputContainer} from "../InputContainer";

describe("InputContainer test", () => {

    it.each([
        ["email", "nice@test.dev", "email"],
        ["text", "some text    ", "text"],
        ["slider", 2, "slider"],
        ["spinner", 1, "spinner"],
    ])('form data structure for %s with value %s and name %s', (type, value, name) => {
        const input = node('input');
        const expectedAttr: Attr = {} as Attr;
        expectedAttr[name] = [value];
        input.addAttributes({
            type: type as string,
            value: value as string,
            name: name as string
        });
        const attributes: Attr = {} as Attr;
        InputContainer.addValuesToAttributes(input.unwrap() as HTMLInputElement, attributes);
        expect(attributes).toEqual(expectedAttr)
    });

    it.each(InputContainer.ELEMENTS.map(element => {
        const tagAndClass = element.split(".");
        const dataPrefix = tagAndClass[0] != "input" ? "data-" : "";
        const markup = `<${tagAndClass[0]} class="${tagAndClass[1]}" ${dataPrefix}value="bar" ${dataPrefix}name="foo"/>`;
        return [markup, {foo: ["bar"]}]
    }))('values can be retrieved from %s.%s', (html, expected) => {
        const submit = document.createElement("button") as HTMLButtonElement;
        const form = document.createElement("form") as HTMLFormElement;
        form.innerHTML = html.toString();
        return InputContainer.getAll(form, submit)
            .then(attr => expect(attr).toEqual(expected))
    });
});
