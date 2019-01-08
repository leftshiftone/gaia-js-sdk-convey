import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Headline extends AbstractRenderable {

    public message: any;
    public text: string;
    public position: string;

    constructor(message: any) {
        super('headline');
        this.message = message;
        this.text = message.text;
        this.position = message.position;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const position = this.position || 'left';
        const headline = document.createElement('h2');
        headline.classList.add('headline', position);
        headline.appendChild(document.createTextNode(this.text));
        container.appendChild(headline);
    }

}
