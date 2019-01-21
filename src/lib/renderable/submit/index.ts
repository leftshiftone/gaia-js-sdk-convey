import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {IRenderable} from '../../api/IRenderable';

export class Submit implements IRenderable {

    // TODO: move to utility class
    public static closestByClass(element: any, clazz: string) {
        let el = element;
        while (!el.classList.contains(clazz)) {
            el = el.parentNode;
            if (!el) {
                return null;
            }
        }
        return el;
    }

    private readonly spec:ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const submit = document.createElement('button');

        submit.classList.add("lto-submit", "lto-" + position);
        if (this.spec.class !== undefined) submit.classList.add(this.spec.class);

        if (isNested) {
            submit.classList.add("lto-nested");
        }
        submit.appendChild(document.createTextNode(this.spec.text || ""));

        const text = this.spec.text || "";
        const timestamp = this.spec.timestamp || "";

        submit.addEventListener('click', () => {
            const attributes = {type: 'submit'};

            // FIXME: use generic class name e.g. message-content
            const content = Submit.closestByClass(submit, 'lto-block');

            content.querySelectorAll('input[type=\'checkbox\']').forEach((i: any, checkbox: any) => {
                if (checkbox.checked === true) {
                    const name = checkbox.getAttribute('name');
                    const value = checkbox.getAttribute('value');

                    if (attributes[name] !== undefined) {
                        attributes[name].push(value);
                    } else {
                        attributes[name] = [value];
                    }
                }
            });

            content.querySelectorAll('input[type=\'range\']').forEach((i: any, range: any) => {
                const name = range.getAttribute('name');
                const value = range.getAttribute('value');
                if (attributes[name] !== undefined) {
                    attributes[name].push(value);
                } else {
                    attributes[name] = [value];
                }
            });

            content.querySelectorAll('div[class=\'lto-input\']').forEach((i: any, calendar:any) => {
                const name = calendar.getAttribute('name');
                const value = calendar.getAttribute('value');
                if (attributes[name] !== undefined) {
                    attributes[name].push(value);
                } else {
                    attributes[name] = [value];
                }
            });

            content.querySelectorAll('input[type=\'number\']').forEach((i: any, number: any) => {
                const name = number.getAttribute('name');
                const value = number.getAttribute('value');
                if (attributes[name] !== undefined) {
                    attributes[name].push(value);
                } else {
                    attributes[name] = [value];
                }
            });

            content.querySelectorAll('div[class=\'lto-reel\']').forEach((i: any, number: any) => {
                const name = number.getAttribute('name');
                const value = number.getAttribute('value');
                if (attributes[name] !== undefined) {
                    attributes[name].push(value);
                } else {
                    attributes[name] = [value];
                }
            });

            EventStream.emit("GAIA::publish", {timestamp, text, attributes, type: 'submit', position: 'right'});
        });

        return submit;
    }

}
