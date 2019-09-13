import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../api';
import Renderables from '../Renderables';
import {Timestamp} from '../timestamp';

/**
 * Implementation of the 'block' markup element. A div HTML element
 * is created and the and the classes lto-block is added to
 * allow CSS modifications.
 *
 * @see {@link IRenderable}
 * @see {@link IStackeable}
 */
export class Block implements IRenderable, IStackeable {

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
        block.setAttribute("name", this.spec.name || "");

        if (this.spec.id !== undefined) {
            block.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => block.classList.add(e));
        }

        block.appendChild(Timestamp.render());

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => block.appendChild(x)));

        if (isNested) {
            block.classList.add('lto-nested');
        }
        return block;
    }
}

Renderables.register("block", Block);
