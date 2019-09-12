import {ChoiceContainer} from "../renderable/choice/ChoiceContainer";
import {ChoiceAggregator} from "../renderable/submit/ChoiceAggregator";
import {SubmitState} from "../renderable/submit/SubmitState";
import node from "./node";
import {ChoiceAggregationResult} from "../renderable/submit/ChoiceAggregationResult";

export class InputContainer {

    public static ELEMENTS = [
        'div.lto-calendar-input',
        'div.lto-camera',
        'div.lto-code-reader',
        'div.lto-drop-area',
        'div.lto-map',
        'div.lto-reel',
        'div.lto-trigger',
        'input.lto-email',
        'input.lto-phone',
        'input.lto-slider',
        'input.lto-spinner',
        'input.lto-textInput',
        'textarea.lto-textarea',
    ];
    private static ELEMENTS_AS_STRING: string = InputContainer.ELEMENTS.join(",");

    /**
     * Returns a {@link Promise} containing the attributes of the input elements
     *
     * @param container: the parent form element
     * @param submit: the submit button element
     */
    public static getAll(container: HTMLFormElement, submit: HTMLButtonElement) {
        return new Promise<Attr>((resolve, reject) => {
            let attributes = {} as Attr;
            let state: SubmitState = SubmitState.ALLOWED;

            container.querySelectorAll(this.ELEMENTS_AS_STRING).forEach(e => {
                const newState = InputContainer.addValuesToAttributes(e as HTMLElement, attributes);
                console.debug(`State is ${newState}`);
                if (state == SubmitState.ALLOWED)
                    state = newState
            });

            const choiceContainers = container.querySelectorAll(`div.${ChoiceContainer.CSS_BASE_CLASS}`);
            if (choiceContainers.length > 0) {
                const result: ChoiceAggregationResult = ChoiceAggregator.aggregate(choiceContainers);
                if (result.state === SubmitState.SUBMIT_REQUIRED_ERROR) {
                    state = SubmitState.SUBMIT_REQUIRED_ERROR
                } else {
                    Object.assign(attributes, result.attributes)
                }
            } else {
                container.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                    InputContainer.addValuesToAttributes(checkbox as HTMLElement, attributes);
                });
            }

            container.querySelectorAll(".lto-submit-error").forEach(e => e.remove());
            submit.classList.remove("lto-error");
            Object.keys(SubmitState).map(key => SubmitState[key]).forEach(value => {
                submit.classList.remove(value);
            });

            if (state == SubmitState.ALLOWED) {
                // workaround to keep existing data structure
                if (container.name) {
                    const array = [];
                    for (const e in attributes) {
                        array.push({[e]: attributes[e]})
                    }
                    container.setAttribute("data-value", JSON.stringify(array));
                    attributes = {} as Attr;
                    InputContainer.addValuesToAttributes(container, attributes);
                }
            } else {
                const span = node("span");
                span.addClasses("lto-submit-error", "lto-" + state);
                submit.classList.add("lto-error", "lto-" + state);
                submit.parentElement!.appendChild(span.unwrap());
                reject("not allowed");
            }
            resolve(attributes)
        })
    }

    /**
     * Adds the value of the element to the attributes
     *
     * @param element
     * @param attributes
     */
    public static addValuesToAttributes(element: HTMLElement, attributes: Attr): SubmitState {
        const name = InputContainer.getNormalOrDataAttribute(element, "name") || "undefined";
        const value = InputContainer.getNormalOrDataAttribute(element, "value");
        const required = InputContainer.getRequiredAttribute(element);


        // element value is required but empty
        if (required && !value) {
            if (!element.classList.contains("lto-error")) element.classList.add("lto-error");
            console.warn("Input is required");
            return SubmitState.SUBMIT_REQUIRED_ERROR;
        }

        // element value is not valid
        if (element instanceof HTMLInputElement && !element.checkValidity()) {
            console.warn("Input is not valid");
            if (!element.classList.contains("lto-error")) element.classList.add("lto-error");
            return SubmitState.SUBMIT_VALIDATION_ERROR;
        }

        if (value) {
            let preparedValue = value;
            try {
                preparedValue = JSON.parse(value);
            } catch (e) {
                console.debug(`Unable to parse value as JSON for element ${element}: ${e}`);
            }
            attributes[name] !== undefined ?
                attributes[name].push(preparedValue) :
                attributes[name] = [preparedValue];
        }

        element.classList.remove("lto-error");
        return SubmitState.ALLOWED;
    }

    private static getNormalOrDataAttribute(element: HTMLElement, name: string): string | null {
        if (element.hasAttribute(name)) {
            return element.getAttribute(name);
        } else if (element.hasAttribute(`data-${name}`)) {
            return element.getAttribute(`data-${name}`);
        }
        return null;
    }

    private static getRequiredAttribute(element: HTMLElement): boolean {
        const requiredAttribute = "required";
        if (element.hasAttribute(requiredAttribute)) {
            return true
        } else if (element.hasAttribute("data-required")) {
            return element.getAttribute(`data-${requiredAttribute}`) == "true"
        }
        return false;
    }

    public static setRequiredAttribute(element: HTMLElement, required: string | boolean | null | undefined) {
        if (!required) {
            return;
        }

        if (required == "true" || required == true) {
            if (element.tagName.toLowerCase() == "input" || element.tagName.toLowerCase() == "textarea") {
                element.setAttribute("required", "required");
                return;
            }
            element.setAttribute("data-required", "true");
        }
    }
}
