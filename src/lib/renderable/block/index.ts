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

        const elements = renderer.render(this.spec, false);
        elements.forEach(block.appendChild);

        if (!isNested) {
            renderer.render(new Icon(position), true);
            block.classList.add('nested');
        }
        return block;
    }

    public name = () => "block";

}
