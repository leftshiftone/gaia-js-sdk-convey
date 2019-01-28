import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

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
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const block = document.createElement('div');
        block.classList.add('lto-block', "lto-" + position);
        if (this.spec.class !== undefined) block.classList.add(this.spec.class);
        block.appendChild(Timestamp.render());

        const elements = (this.spec.elements || []).map(e => renderer.render(e, "block"));
        elements.forEach(e => e.forEach(x => block.appendChild(x)));

        if (isNested) {
            block.classList.add('lto-nested');
        }
        return block;
    }
}

Renderables.register("block", Block);
