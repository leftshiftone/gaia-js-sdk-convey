import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'block' markup element.
 */
export class Block implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const position = this.spec.position || 'left';
        const block = document.createElement('div');
        block.classList.add('block', position);
        block.appendChild(Timestamp.render());

        const elements = (this.spec.elements || []).map(e => renderer.render(e, "block"));
        elements.forEach(e => e.forEach(x => block.appendChild(x)));

        if (!isNested) {
            block.appendChild(renderer.render(new Icon(position))[0]);
            block.classList.add('nested');
        }
        return block;
    }

}
