import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'break' markup element.
 * A br HTML element is created.
 *
 * @see {@link IRenderable}
 */
export class Break implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const br = document.createElement('br');
        if (this.spec.id !== undefined) {
            br.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => br.classList.add(e));
        }
        return br;
    }

}

Renderables.register("break", Break);
