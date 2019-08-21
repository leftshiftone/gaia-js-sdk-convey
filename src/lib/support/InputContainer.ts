import {ChoiceContainer} from "../renderable/choice/ChoiceContainer";
import {ChoiceAggregator} from "../renderable/submit/ChoiceAggregator";
import {SubmitState} from "../renderable/submit/SubmitState";
import node from "./node";

export class InputContainer {

    private static ELEMENTS: string = 'input.lto-email, input.lto-phone, input.lto-textInput, div.lto-drop-area, ' +
        'textarea.lto-textarea, input.lto-spinner, div.lto-camera, input.lto-slider, div.lto-calendar-input, ' +
        'div.lto-reel, div.lto-code-reader, div.lto-trigger';

    public static getAll(container: HTMLFormElement) {
        return new Promise<Attr>((resolve, reject) => {
            let attributes = {} as Attr;
            let state: SubmitState = SubmitState.ALLOWED;

            container.querySelectorAll(InputContainer.ELEMENTS).forEach(e => {
                const newState = InputContainer.addInputValuesToAttributes(e as HTMLElement, attributes);
                if (state == SubmitState.ALLOWED)
                    state = newState
            });

            const choiceContainers = container.querySelectorAll(`div.${ChoiceContainer.CSS_BASE_CLASS}`);
            if (choiceContainers.length > 0) {

                const choiceAttrs = ChoiceAggregator.aggregate(choiceContainers);
                if (choiceAttrs === false) {
                    state = SubmitState.SUBMIT_REQUIRED_ERROR;
                } else {
                    Object.assign(attributes, choiceAttrs);
                }
            } else {
                container.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                    InputContainer.addInputValuesToAttributes(checkbox as HTMLElement, attributes);
                });
            }
            container.querySelectorAll(".lto-submit-error").forEach(e => e.remove());
            if (state == SubmitState.ALLOWED) {
                // workaround to keep existing data structure
                if (container.name) {
                    const array = [];
                    for (const e in attributes) {
                        array.push({[e]: attributes[e]})
                    }
                    container.setAttribute("value", JSON.stringify(array));
                    attributes = {} as Attr;
                    InputContainer.addInputValuesToAttributes(container, attributes);
                }
            } else {
                const span = node("span");
                span.addClasses("lto-submit-error", "lto-" + state);
                container.appendChild(span.unwrap());
                reject("not allowed");
            }
            resolve(attributes)
        })
    }

    public static isAllowed(value: any) {
        return !(!value || value == "" || value == undefined);
    }

    public static addInputValuesToAttributes(element: HTMLElement, attributes: Attr): SubmitState {
        const name = element.getAttribute("name") || "undefined";
        let value = element.getAttribute("value");
        const required = JSON.parse(element.getAttribute("required") || "false");

        if (required && !InputContainer.isAllowed(value)) {
            // element value is required but empty
            return SubmitState.SUBMIT_REQUIRED_ERROR;
        }
        if (element instanceof HTMLInputElement && !element.checkValidity()) {
            // element value is not valid
            return SubmitState.SUBMIT_VALIDATION_ERROR;
        }

        if (InputContainer.isAllowed(value)) {
            if (/^[\],:{}\s]*$/.test(value!.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                value = JSON.parse(value!);
            }
            attributes[name] !== undefined ?
                attributes[name].push(value) :
                attributes[name] = [value];
        }

        return SubmitState.ALLOWED;
    }

}
