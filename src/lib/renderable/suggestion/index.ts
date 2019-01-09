import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';

export class Suggestion extends AbstractRenderable {

    public text: string;
    public buttonName: string;
    public value: string;

    constructor(message: any) {
        super('suggestion');
        this.text = message.text;
        this.buttonName = message.name;
        this.value = message.value;
    }

    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const button = document.createElement('button');
        button.setAttribute('name', this.buttonName);

        if (!isNested) {
            button.classList.add('button', "left");
        } else {
            button.classList.add('button-nested', "left");
        }
        button.appendChild(document.createTextNode(this.text));

        button.addEventListener('click', () => {
            EventStream.emit("Gaia::publish", {
                    type: 'button',
                    text: this.text,
                    attributes: {type: 'button', name: this.buttonName, value: this.value}
                },
            );
        });

        return button;
    }
}
