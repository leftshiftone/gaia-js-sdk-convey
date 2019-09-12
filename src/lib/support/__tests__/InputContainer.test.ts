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
    }))('values can be retrieved from %s', (html, expected) => {
        const submit = document.createElement("button") as HTMLButtonElement;
        const form = document.createElement("form") as HTMLFormElement;
        form.innerHTML = html.toString();
        form.appendChild(submit);
        return InputContainer.getAll(form, submit)
            .then(attr => expect(attr).toEqual(expected))
    });

    it.each(InputContainer.ELEMENTS.map(element => {
        const tagAndClass = element.split(".");
        const dataPrefix = tagAndClass[0] != "input" ? "data-" : "";
        const required = tagAndClass[0] != "input" ? `data-required="false"` : "";
        const markup = `<${tagAndClass[0]} class="${tagAndClass[1]}" ${dataPrefix}value="" ${dataPrefix}name="foo" ${required}/>`;
        return [markup, {}]
    }))('no values given for not required inputs returns empty data for %s', (html, expected) => {
        const submit = document.createElement("button") as HTMLButtonElement;
        const form = document.createElement("form") as HTMLFormElement;
        form.innerHTML = html.toString();
        form.appendChild(submit);
        return InputContainer.getAll(form, submit)
            .then(attr => expect(attr).toEqual(expected))
    });

    it.each(InputContainer.ELEMENTS.map(element => {
        const tagAndClass = element.split(".");
        const dataPrefix = tagAndClass[0] != "input" ? "data-" : "";
        const required = tagAndClass[0] != "input" ? `data-required="true"` : "required=\"required\"";
        const markup = `<${tagAndClass[0]} class="${tagAndClass[1]}" ${dataPrefix}value="" ${dataPrefix}name="foo" ${required}/>`;
        return [markup]
    }))('no values given for required inputs is not allowed for %s', (html) => {
        const submit = document.createElement("button") as HTMLButtonElement;
        const form = document.createElement("form") as HTMLFormElement;
        form.innerHTML = html.toString();
        form.appendChild(submit);
        return InputContainer.getAll(form, submit)
            .then(() => fail("Expected to fail"))
            .catch(reason => expect(reason).toEqual("not allowed"))
    });

    it.each([
        ["input", "false", null],
        ["input", "foo", null],
        ["input", null, null],
        ["input", false, null],
        ["input", undefined, null],
        ["input", "true", "required"],
        ["input", true, "required"],
        ["textarea", "false", null],
        ["textarea", "foo", null],
        ["textarea", null, null],
        ["textarea", false, null],
        ["textarea", undefined, null],
        ["textarea", "true", "required"],
        ["textarea", true, "required"],
        ["div", "false", null],
        ["div", "foo", null],
        ["div", null, null],
        ["div", false, null],
        ["div", undefined, null],
        ["div", "true", "true"],
        ["div", true, "true"],
    ])('required attribute is added depending on the element %s with spec %s to %s', (tagName: string, required, expected) => {
        const element = document.createElement(tagName);
        InputContainer.setRequiredAttribute(element, required);

        if (tagName == "input" || tagName == "textarea") {
            expect(element.getAttribute("required")).toEqual(expected);
        } else {
            expect(element.getAttribute("data-required")).toEqual(expected);
        }
    });
});
