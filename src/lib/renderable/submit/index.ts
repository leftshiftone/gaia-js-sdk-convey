import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

export class Submit implements IRenderable {

    // TODO: move to utility class
    public static closestByClass(element: any, clazz: string) {
        let el = element;
        while (!el.classList.contains(clazz)) {
            el = el.parentNode;
            if (!el || !el.classList) {
                return null;
            }
        }
        return el;
    }

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const submit: HTMLButtonElement = document.createElement('button');

        submit.classList.add("lto-submit", "lto-" + position);
        if (this.spec.class !== undefined) submit.classList.add(this.spec.class);

        if (isNested) {
            submit.classList.add("lto-nested");
        }
        submit.appendChild(document.createTextNode(this.spec.text || ""));

        const text = this.spec.text || "";
        const timestamp = this.spec.timestamp || "";

        submit.addEventListener('click', () => {
            const attributes:Attr = {} as Attr;

            // FIXME: use generic class name e.g. message-content
            const content = Submit.closestByClass(submit, 'lto-block');

            content.querySelectorAll('input[type=\'checkbox\']').forEach((checkbox: HTMLInputElement) => {
                if (checkbox.checked === true) {
                    Submit.addElementValueToAttributes(checkbox, attributes);
                }
            });

            content.querySelectorAll('div.lto-map').forEach((map: HTMLElement) => {
                if (map.getAttribute("value") !== null) {
                    Submit.addElementValueToAttributes(map, attributes);
                }
            });

            this.addValuesToAttributes(content, 'input[type=\'number\']', attributes);
            this.addValuesToAttributes(content, 'input[type=\'range\']', attributes);
            this.addValuesToAttributes(content, 'div.lto-input', attributes);
            this.addValuesToAttributes(content, 'div.ical-event-input', attributes);
            this.addValuesToAttributes(content, 'div.lto-reel', attributes);

            if (Object.keys(attributes).length > 0) {
                submit.disabled = true;
                EventStream.emit("GAIA::publish", {timestamp, text, attributes: {type: 'submit', value: JSON.stringify(attributes)}, type: 'submit', position: 'right'});

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

        return submit;
    }

    private addValuesToAttributes(parentElement: any, selector: string, attributes: Attr) {
        parentElement.querySelectorAll(selector).forEach((element: any) => {
            Submit.addElementValueToAttributes(element, attributes);
        });
    }

    private static addElementValueToAttributes(element: any, attributes: Attr) {
        const name = element.getAttribute('name');
        let value;

        // check if attribute value is valid JSON string
        if (/^[\],:{}\s]*$/.test(element.getAttribute("value").replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            value = JSON.parse(element.getAttribute('value'))
        } else {
            value = element.getAttribute('value');
        }
        if (attributes[name] !== undefined) {
            attributes[name].push(value);
        } else {
            attributes[name] = [value];
        }
    }

}

Renderables.register("submit", Submit);
