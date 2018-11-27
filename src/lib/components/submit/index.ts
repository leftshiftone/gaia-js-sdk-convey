import { MarkupComponent } from '../markup-component';

export class Submit extends MarkupComponent {

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

    public render(container: any, sendMessage: any) {
        console.debug('Send message function: ');
        console.debug(sendMessage);

        const position = this.position || 'left';
        const submit = document.createElement('button');

        if (!Submit.isNested(container)) {
            submit.classList.add('submit', position);
        } else {
            submit.classList.add('submit-nested', position);
        }

        submit.appendChild(document.createTextNode(this.text));
        container.appendChild(submit);
        const text = this.text;
        const timestamp = this.timestamp;

        submit.addEventListener('click', (ev) => {
            const attributes = {};

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
            sendMessage({
                timestamp,
                text,
                attributes,
                type: 'submit',
                position: 'right',
            });
        });
    }

}
