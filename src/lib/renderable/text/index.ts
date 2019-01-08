import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Text extends AbstractRenderable {

    public text: string;
    public position: string;

    constructor(message: any) {
        super('text');
        this.text = message.text;
        this.position = message.position;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        if (!Text.isNested(container)) {
            const position = this.position || 'left';
            const text = document.createElement('div');
            text.classList.add('text', position);
            text.appendChild(Timestamp.render());
            text.appendChild(document.createTextNode(this.text));
            container.appendChild(new Icon(position).render());
            container.appendChild(text);
        } else {
            container.appendChild(document.createTextNode(this.text));
        }
    }
}
