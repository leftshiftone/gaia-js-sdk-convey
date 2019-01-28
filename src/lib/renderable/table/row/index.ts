import {IRenderer, ISpecification} from '../../../api/IRenderer';
import {IRenderable} from '../../../api/IRenderable';
import Renderables from '../../Renderables';

/**
 * Implementation of the 'row' markup element.
 */
export class Row implements IRenderable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const row = document.createElement('tr');
        if (this.spec.class !== undefined) row.classList.add(this.spec.class);
        row.classList.add('lto-row');

        const elements = (this.spec.elements || []).map(e => renderer.render(e, "row"));
        elements.forEach(e => e.forEach(x => row.appendChild(x)));

        return row;
    }

}
Renderables.register("row", Row);
