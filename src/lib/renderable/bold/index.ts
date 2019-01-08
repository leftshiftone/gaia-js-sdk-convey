import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Bold extends AbstractRenderable {

    public text: string;

    constructor(message: any) {
        super('bold');
        this.text = message.text;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const bold = document.createElement('b');
        bold.classList.add('bold');
        bold.appendChild(document.createTextNode(this.text));
        container.appendChild(bold);
    }

}
