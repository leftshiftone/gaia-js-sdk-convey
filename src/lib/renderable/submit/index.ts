import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import Properties from "../Properties";
import {closestByClass} from "../../support/Elements";
import {ChoiceAggregator} from "./ChoiceAggregator";
import {ChoiceContainer} from "../choice/ChoiceContainer";

export class Submit implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const submit: HTMLButtonElement = document.createElement('button');

        submit.classList.add("lto-submit", "lto-" + position);
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => submit.classList.add(e));
        }

        if (isNested) {
            submit.classList.add("lto-nested");
        }
        submit.appendChild(document.createTextNode(this.spec.text || ""));

        const text = this.spec.text || "";
        const timestamp = this.spec.timestamp || "";
        if (this.spec.storeInContext) {
            submit.addEventListener('click', () => {
                const attributes: Attr = {} as Attr;

                // FIXME: use generic class name e.g. message-content
                const content = closestByClass(submit, ['lto-block', 'lto-form']);

                if (content.classList.contains("lto-block")) {

                    const choiceContainers = content.querySelectorAll(`div.${ChoiceContainer.CSS_BASE_CLASS}`);
                    if (choiceContainers.length > 0) {
                        Object.assign(attributes, ChoiceAggregator.aggregate(choiceContainers));
                    } else {
                        content.querySelectorAll('input[type=\'checkbox\']').forEach((checkbox) => {
                            Submit.addElementValueToAttributes(checkbox, attributes);
                        });
                    }

                    content.querySelectorAll('div.lto-map').forEach((map) => {
                        if (map.getAttribute("value") !== null) {
                            Submit.addElementValueToAttributes(map, attributes);
                        }
                    });

                    content.querySelectorAll('input.lto-textInput').forEach((element) => {
                        if (element.getAttribute("value") !== null) {
                            if ((element as HTMLInputElement).checkValidity()) {
                                Submit.addElementValueToAttributes(element, attributes);
                            }
                        }
                    });

                    this.addValuesToAttributes(content, 'input.lto-spinner', attributes);
                    this.addValuesToAttributes(content, 'div.lto-camera', attributes);
                    this.addValuesToAttributes(content, 'div.lto-drop-area', attributes);
                    this.addValuesToAttributes(content, 'input.lto-slider', attributes);
                    this.addValuesToAttributes(content, 'div.lto-input', attributes);
                    this.addValuesToAttributes(content, 'div.ical-event-input', attributes);
                    this.addValuesToAttributes(content, 'div.lto-reel', attributes);
                } else if (content.classList.contains("lto-form")) {
                    const form = content as HTMLFormElement;
                    const values: Array<any> = [];
                    let allowed = true;

                    form.querySelectorAll("input.lto-email, div.lto-drop-area, input.lto-phone, input.lto-textInput").forEach(element => {
                        const value = element.getAttribute("value");
                        const name = element.getAttribute("name");

                        // check if element is type of input
                        if (element instanceof HTMLInputElement) {
                            // is element required?
                            if ((element as HTMLInputElement).required) {
                                value !== null ?
                                    (element as HTMLInputElement).checkValidity() ?
                                        values.push({[name as string]: value}) :
                                        allowed = false :
                                    allowed = false;
                            } else if (value !== null) {
                                (element as HTMLInputElement).checkValidity() ? values.push({[name as string]: value}) : allowed = false;
                            }
                        } else {
                            value !== null ? values.push({[name as string]: value}) : allowed = false;
                        }
                    });
                    if (allowed) {
                        if (form.getAttribute("name") !== "") {
                            form.setAttribute("value", JSON.stringify(values));
                            Submit.addElementValueToAttributes(form, attributes);
                        } else {
                            this.addValuesToAttributes(content, 'div.lto-drop-area', attributes);
                            this.addValuesToAttributes(content, 'input.lto-phone', attributes);
                            this.addValuesToAttributes(content, 'input.lto-email', attributes);
                            this.addValuesToAttributes(content, 'input.lto-textInput', attributes);
                        }
                    }
                }

                if (Object.keys(attributes).length > 0) {
                    submit.disabled = true;
                    content.style.pointerEvents = "none";

                    EventStream.emit("GAIA::publish", {
                        timestamp,
                        text,
                        attributes: {type: 'submit', value: JSON.stringify(attributes)},
                        type: 'submit',
                        position: 'right'
                    });

                    const elements = document.querySelectorAll('.lto-button.lto-left');
                    elements.forEach(element => element.remove());

                    // remove left submits
                    const submits = document.querySelectorAll('.lto-submit.lto-left');
                    submits.forEach(element => element.remove());

                    // remove left suggestions
                    const suggestions = document.querySelectorAll('.lto-suggestion.lto-left');
                    suggestions.forEach(element => element.remove());
                }
            });
        } else {
            submit.addEventListener('click', () => {
                const DEFAULT_HEADER = {"Content-Type": "application/json"};
                const DEFAULT_METHOD = "POST";

                const content = closestByClass(submit, ['lto-block', 'lto-form']);

                content.querySelectorAll("div.lto-drop-area").forEach((element) => {
                    const name = element.getAttribute("name");
                    const value = element.getAttribute("value");
                    const method = Properties.resolve("SUBMIT_" + name + "_HTTP_METHOD") || DEFAULT_METHOD;
                    const headers = Properties.resolve("SUBMIT_" + name + "_HEADERS") || DEFAULT_HEADER;

                    if (value !== null) {
                        if (this.spec.destination) {
                            fetch(this.spec.destination, {
                                method: method,
                                headers: headers,
                                body: value
                            }).then(response => {
                                    EventStream.emit("GAIA::publish", {
                                        timestamp, text,
                                        attributes: {type: 'submit', value: {[name as string]: response.statusText}},
                                        type: 'submit',
                                        position: 'right'
                                    });
                                    content.style.pointerEvents = "none";
                                }
                            ).catch(reason => console.error("ERROR: " + reason));
                        } else {
                            console.error("ERROR: destination is not defined");
                        }
                    }
                });
            });
        }

        return submit;
    }

    private addValuesToAttributes(parentElement: any, selector: string, attributes: Attr) {
        parentElement.querySelectorAll(selector).forEach((element: any) => {
            Submit.addElementValueToAttributes(element, attributes);
        });
    }

    private static addElementValueToAttributes(element: any, attributes: Attr) {
        const name = element.getAttribute('name');
        let value = element.getAttribute("value");

        if (value !== null) {
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
