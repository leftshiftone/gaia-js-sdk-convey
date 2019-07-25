import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {closestByClass} from "../../support/Elements";
import {ChoiceAggregator} from "./ChoiceAggregator";
import {ChoiceContainer} from "../choice/ChoiceContainer";
import {Button} from "../button";

export class Submit implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const submit: HTMLButtonElement = document.createElement('button');

        submit.classList.add("lto-submit", "lto-" + position);
        if (this.spec.id !== undefined) {
            submit.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => submit.classList.add(e));
        }

        if (isNested) {
            submit.classList.add("lto-nested");
        }
        submit.appendChild(document.createTextNode(this.spec.text || ""));

        const text = this.spec.text || "";
        const timestamp = this.spec.timestamp || "";
        submit.addEventListener("click", () => {
            let attributes: Attr = {} as Attr;

            // FIXME: use generic class name e.g. message-content
            const content = closestByClass(submit, ["lto-block", "lto-form"]);

            if (content.classList.contains("lto-block")) {

                const choiceContainers = content.querySelectorAll(`div.${ChoiceContainer.CSS_BASE_CLASS}`);
                if (choiceContainers.length > 0) {
                    Object.assign(attributes, ChoiceAggregator.aggregate(choiceContainers));
                } else {
                    content.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                        Submit.addElementValueToAttributes(checkbox as HTMLElement, attributes);
                    });
                }

                content.querySelectorAll("div.lto-map").forEach((map) => {
                    if (map.getAttribute("value") !== null) {
                        Submit.addElementValueToAttributes(map as HTMLElement, attributes);
                    }
                });

                content.querySelectorAll("input.lto-textInput").forEach((element) => {
                    if (element.getAttribute("value") !== null) {
                        if ((element as HTMLInputElement).checkValidity()) {
                            Submit.addElementValueToAttributes(element as HTMLElement, attributes);
                        }
                    }
                });

                this.addValuesToAttributes(content, "input.lto-spinner", attributes);
                this.addValuesToAttributes(content, "div.lto-camera", attributes);
                this.addValuesToAttributes(content, "div.lto-drop-area", attributes);
                this.addValuesToAttributes(content, "input.lto-slider", attributes);
                this.addValuesToAttributes(content, "div.lto-calendar-input", attributes);
                this.addValuesToAttributes(content, "div.ical-event-input", attributes);
                this.addValuesToAttributes(content, "div.lto-reel", attributes);
                this.addValuesToAttributes(content, "div.lto-code-reader", attributes);
                this.addValuesToAttributes(content, "textarea.lto-textarea", attributes);
            } else if (content.classList.contains("lto-form")) {
                const form = content as HTMLFormElement;
                let allowed = true;
                let inputAttributes: Attr = {} as Attr;

                form.querySelectorAll('input.lto-email, input.lto-phone, input.lto-textInput, div.lto-drop-area, textarea.lto-textarea').forEach(e => {
                    const b = Submit.addInputValuesToAttributes(e as HTMLInputElement, inputAttributes);
                    if(allowed)
                        allowed = b
                });

                if (allowed) {
                    const choiceContainers = content.querySelectorAll(`div.${ChoiceContainer.CSS_BASE_CLASS}`);
                    if (choiceContainers.length > 0) {
                        Object.assign(attributes, ChoiceAggregator.aggregate(choiceContainers));
                    } else {
                        content.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                            Submit.addElementValueToAttributes(checkbox as HTMLElement, attributes);
                        });
                    }

                    // workaround to keep existing data structure
                    if (form.name) {
                        const array = [];
                        for(const e in inputAttributes) {
                            array.push({[e]: inputAttributes[e]})
                        }

                        form.setAttribute("value", JSON.stringify(array));

                        Submit.addElementValueToAttributes(form, attributes);
                    } else {
                        for(const e in inputAttributes) {
                            attributes[e] !== undefined ?
                                attributes[e].push(inputAttributes[e]) :
                                attributes[e] = [inputAttributes[e]];
                        }
                    }

                } else attributes = {} as Attr;

            }

            if (Object.keys(attributes).length > 0) {
                submit.disabled = true;
                content.style.pointerEvents = "none";

                EventStream.emit("GAIA::publish", {
                    timestamp,
                    text,
                    attributes: {type: "submit", value: JSON.stringify(attributes)},
                    type: "submit",
                    position: "right"
                });

                Button.cleanupButtons();
            }
        });

        return submit;
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

    private addValuesToAttributes(parentElement: HTMLElement, selector: string, attributes: Attr) {
        parentElement.querySelectorAll(selector).forEach((element: any) => {
            Submit.addElementValueToAttributes(element, attributes);
        });
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

Renderables.register("submit", Submit);
