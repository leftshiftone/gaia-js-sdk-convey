import {AbstractRenderable} from '../AbstractRenderable';
import {Timestamp} from '../timestamp';
import {Icon} from '../icon';
import {IRenderer} from '../../api/IRenderer';

export class Items extends AbstractRenderable {

    public message: any;

    constructor(message: any) {
        super('items');
        this.message = message;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        if (!Items.isNested(container)) {
            const div = document.createElement('div');
            div.classList.add('items');
            div.appendChild(Timestamp.render());

            const items = document.createElement('ul');
            div.appendChild(items);

            this.renderElements(renderer, items, this.message, sendMessage);
            container.appendChild(new Icon(this.message.position || 'left').render());
            container.appendChild(div);
        } else {
            const items = document.createElement('ul');
            this.renderElements(renderer, items, this.message, sendMessage);
            container.appendChild(items);
        }
    }

}
