import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';

export class Submit extends AbstractRenderable {

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

    public text: string;
    public position: string;
    public timestamp: any;

    constructor(message: any) {
        super('submit');
        this.text = message.text;
        this.position = message.position;
        this.timestamp = message.timestamp;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.position || 'left';
        const submit = document.createElement('button');

        if (!isNested) {
            submit.classList.add('submit', position);
        } else {
            submit.classList.add('submit-nested', position);
        }

        submit.appendChild(document.createTextNode(this.text));

        const text = this.text;
        const timestamp = this.timestamp;

        submit.addEventListener('click', (ev) => {
            const attributes = {type: 'submit'};

            // FIXME: use generic class name e.g. message-content
            const content = Submit.closestByClass(submit, 'block');
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

            EventStream.emit("Gaia::publish", {timestamp, text, attributes, type: 'submit', position: 'right'});
        });

        return submit;
    }

}
