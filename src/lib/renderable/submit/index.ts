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
        const submit : HTMLButtonElement = document.createElement('button');

        submit.classList.add("lto-submit", "lto-" + position);
        if (this.spec.class !== undefined) submit.classList.add(this.spec.class);

        if (isNested) {
            submit.classList.add("lto-nested");
        }
        submit.appendChild(document.createTextNode(this.spec.text || ""));

        const text = this.spec.text || "";
        const timestamp = this.spec.timestamp || "";

        submit.addEventListener('click', () => {
            const attributes = {};

            // FIXME: use generic class name e.g. message-content
            const content = Submit.closestByClass(submit, 'lto-block');

            content.querySelectorAll('input[type=\'checkbox\']').forEach((checkbox: any) => {
                if (checkbox.checked === true) {
                    this.addElementValueToAttributes(checkbox, attributes);
                }
            });
            this.addValuesToAttributes(content, 'input[type=\'range\']', attributes);
            this.addValuesToAttributes(content, 'div[class=\'lto-input\']', attributes);
            this.addValuesToAttributes(content, 'div[class=\'ical-event-input\']', attributes);
            this.addValuesToAttributes(content, 'input[type=\'number\']', attributes);
            this.addValuesToAttributes(content, 'div[class=\'lto-reel\']', attributes);

            if (Object.keys(attributes).length > 0) {
                submit.disabled = true;
                EventStream.emit("GAIA::publish", {timestamp, text, attributes:{type: 'submit', value : JSON.stringify(attributes)}, type: 'submit', position: 'right'});
            }
        });

        return submit;
    }

    private addValuesToAttributes(parentElement: any, selector: string, attributes: any) {
        parentElement.querySelectorAll(selector).forEach((element: any) => {
            this.addElementValueToAttributes(element, attributes);
        });
    }

    private addElementValueToAttributes(element: any, attributes: any) {
        const name = element.getAttribute('name');
        const value = element.getAttribute('value');
        if (attributes[name] !== undefined) {
            attributes[name].push(value);
        } else {
            attributes[name] = [value];
        }
    }

}
Renderables.register("submit", Submit);
