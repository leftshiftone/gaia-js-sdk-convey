import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {MarkupComponent} from '../markup-component';

export class Text extends MarkupComponent {

    public text: string;
    public position: string;

    constructor(message: any) {
        super('text');
        this.text = message.text;
        this.position = message.position;
    }

    public render(container: HTMLElement) {
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
