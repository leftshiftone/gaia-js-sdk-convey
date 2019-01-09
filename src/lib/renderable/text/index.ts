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

    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        if (!isNested) {
            const position = this.position || 'left';
            const text = document.createElement('div');
            text.classList.add('text', position);
            text.appendChild(Timestamp.render());
            text.appendChild(document.createTextNode(this.text));
            text.appendChild(new Icon(position).render());

            return text;
        }
        const text = document.createElement('div');
        text.appendChild(document.createTextNode(this.text));

        return text;
    }
}
