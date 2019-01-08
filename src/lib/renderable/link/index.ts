import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Link extends AbstractRenderable {

    public text: string;
    public value: string;

    constructor(message: any) {
        super('link');
        this.text = message.text;
        this.value = message.value;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const link = document.createElement('a');
        link.setAttribute('href', this.value);
        link.setAttribute('target', '_blank');
        link.classList.add('link');
        link.appendChild(document.createTextNode(this.text));
        container.appendChild(link);
    }

}
