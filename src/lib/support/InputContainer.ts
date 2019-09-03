import {ChoiceContainer} from "../renderable/choice/ChoiceContainer";
import {ChoiceAggregator} from "../renderable/submit/ChoiceAggregator";
import {SubmitState} from "../renderable/submit/SubmitState";
import node from "./node";
import {ChoiceAggregationResult} from "../renderable/submit/ChoiceAggregationResult";

/**
 *
 * @author patrick.arbeiter@leftshift.one
 */
export class InputContainer {

    private static ELEMENTS: string = 'input.lto-email, input.lto-phone, input.lto-textInput, div.lto-drop-area, ' +
        'textarea.lto-textarea, input.lto-spinner, div.lto-camera, input.lto-slider, div.lto-calendar-input, ' +
        'div.lto-reel, div.lto-code-reader, div.lto-trigger, div.lto-map';

    /**
     * returns a {@link Promise} containing the attributes of the input elements
     *
     * @param container: the parent element
     */
    public static getAll(container: HTMLFormElement) {
        return new Promise<Attr>((resolve, reject) => {
            let attributes = {} as Attr;
            let state: SubmitState = SubmitState.ALLOWED;

            container.querySelectorAll(InputContainer.ELEMENTS).forEach(e => {
                const newState = InputContainer.addValuesToAttributes(e as HTMLElement, attributes);
                if (state == SubmitState.ALLOWED)
                    state = newState
            });

            const choiceContainers = container.querySelectorAll(`div.${ChoiceContainer.CSS_BASE_CLASS}`);
            if (choiceContainers.length > 0) {
                const result: ChoiceAggregationResult = ChoiceAggregator.aggregate(choiceContainers);
                result.state === SubmitState.SUBMIT_REQUIRED_ERROR ?
                    state = SubmitState.SUBMIT_REQUIRED_ERROR :
                    Object.assign(attributes, result.attributes)
            } else {
                container.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                    InputContainer.addValuesToAttributes(checkbox as HTMLElement, attributes);
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
                    InputContainer.addValuesToAttributes(container, attributes);
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

    /**
     * adds the value of the element to the attributes
     *
     * @param element
     * @param attributes
     */
    public static addValuesToAttributes(element: HTMLElement, attributes: Attr): SubmitState {
        const name = element.getAttribute("name") || "undefined";
        let value = element.getAttribute("value");
        const required = JSON.parse(element.dataset.required || "false");

        // element value is required but empty
        if (required && !value) {
            if(!element.classList.contains("lto-error")) element.classList.add("lto-error");
            return SubmitState.SUBMIT_REQUIRED_ERROR;
        }

        // element value is not valid
        if (element instanceof HTMLInputElement && (element.type == "email" || element.pattern) && !element.checkValidity()) {
            if(!element.classList.contains("lto-error")) element.classList.add("lto-error");
            return SubmitState.SUBMIT_VALIDATION_ERROR;
        }

        if (value) {
            if (/^[\],:{}\s]*$/.test(value!.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                value = JSON.parse(value!);
            }
            attributes[name] !== undefined ?
                attributes[name].push(value) :
                attributes[name] = [value];
        }

        element.classList.remove("lto-error");

        return SubmitState.ALLOWED;
    }

}
