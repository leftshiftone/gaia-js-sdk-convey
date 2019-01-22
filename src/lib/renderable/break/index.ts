import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'break' markup element.
 */
export class Break implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const br = document.createElement('br');
        if (this.spec.class !== undefined) br.classList.add(this.spec.class);
        return br;
    }

}
