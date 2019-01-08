import node from '../../support/node';
import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Checkbox extends AbstractRenderable {

    public text: string;
    public value: string;
    public position: string;

    constructor(message: any) {
        super('checkbox');
        this.text = message.text;
        this.value = message.value;
        this.position = message.position || 'left';
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const checkbox = node('input').addAttributes({type: 'checkbox', name: this.name});
        const label = node('label').addClasses('checkbox', this.position);

        label.appendChild(checkbox);
        label.appendChild(this.text);
        label.onClick((e: MouseEvent) => {
            checkbox.toggle();
            label.toggleClass('toggle');
        });

        container.appendChild(label.unwrap());
    }

}
