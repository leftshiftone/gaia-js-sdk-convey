import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer, ISpecification} from '../../api/IRenderer';

/**
 * Implementation of the 'block' markup element.
 */
export class Block extends AbstractRenderable {

    private readonly message: ISpecification;

    constructor(message: ISpecification) {
        super('block');
        this.message = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const position = this.message.position || 'left';
        const block = document.createElement('div');
        block.classList.add('block', position);
        block.appendChild(Timestamp.render());

        const elements = renderer.render(this.message, false);
        elements.forEach(block.appendChild);

        if (!isNested) {
            renderer.render(new Icon(position), true);
            block.classList.add('nested');
        }
        return block;
    }

}
