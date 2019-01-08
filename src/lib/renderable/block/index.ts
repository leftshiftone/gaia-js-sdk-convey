import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Block extends AbstractRenderable {

    public message: any;
    public position: string;

    constructor(message: any) {
        super('block');
        this.message = message;
        this.position = message.position;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const position = this.position || 'left';
        const block = document.createElement('div');
        block.classList.add('block');
        block.classList.add(position);
        block.appendChild(Timestamp.render());
        this.renderElements(renderer, block, this.message, sendMessage);
        if (!Block.isNested(container)) {
            container.appendChild(new Icon(position).render());
            block.classList.add('nested');
        }
        container.appendChild(block);
    }

}
