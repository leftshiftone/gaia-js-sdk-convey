import {ChoiceContainer} from "../renderable/choice/ChoiceContainer";
import {ChoiceAggregator} from "../renderable/submit/ChoiceAggregator";

export class InputContainer {

    private static ELEMENTS: string = 'input.lto-email, input.lto-phone, input.lto-textInput, div.lto-drop-area, ' +
    'textarea.lto-textarea, input.lto-spinner, div.lto-camera, input.lto-slider, div.lto-calendar-input, ' +
    'div.lto-reel, div.lto-code-reader, div.lto-trigger';

    public static getAll(container: HTMLFormElement) {
        let inputAttributes: Attr = {} as Attr;
        let allowed = true;

        container.querySelectorAll(InputContainer.ELEMENTS).forEach(e => {
            const b = InputContainer.addInputValuesToAttributes(e as HTMLInputElement, inputAttributes);
            if(allowed)
                allowed = b
        });

        if (allowed) {
            const choiceContainers = container.querySelectorAll(`div.${ChoiceContainer.CSS_BASE_CLASS}`);
            if (choiceContainers.length > 0) {
                Object.assign(inputAttributes, ChoiceAggregator.aggregate(choiceContainers));
            } else {
                container.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                    InputContainer.addElementValueToAttributes(checkbox as HTMLElement, inputAttributes);
                });
            }

            // workaround to keep existing data structure
            if (container.name) {
                const array = [];
                for(const e in inputAttributes) {
                    array.push({[e]: inputAttributes[e]})
                }

                container.setAttribute("value", JSON.stringify(array));

                InputContainer.addElementValueToAttributes(container, inputAttributes);
            } else {
                for(const e in inputAttributes) {
                    inputAttributes[e] !== undefined ?
                        inputAttributes[e].push(inputAttributes[e]) :
                        inputAttributes[e] = [inputAttributes[e]];
                }
            }

        } else inputAttributes = {} as Attr;

        return inputAttributes
    }


    public static addInputValuesToAttributes(element: HTMLInputElement, attributes: Attr) {
        const name = element.getAttribute("name") || "undefined";
        let value = element.getAttribute("value");
        if (element.required) {
            if (value == "" || value == undefined)
                return false;
            else if (!element.checkValidity())
                return false;
        } else {
            if (value !== "" && value !== undefined)
                if (!element.checkValidity())
                    return false;
        }

        attributes[name] = value;

        return true;
    }

    public static addElementValueToAttributes(element: HTMLElement, attributes: Attr) {
        const name = element.getAttribute("name") || "undefined";
        let value = element.getAttribute("value");

        if (value !== null && value) {
            // check if attribute value is valid JSON string
            if (/^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                value = JSON.parse(value);
            }

            attributes[name] !== undefined ?
                attributes[name].push(value) :
                attributes[name] = [value];
        }
    }



}
