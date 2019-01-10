import {IRenderer, ISpecification} from '../../../api/IRenderer';
import {IRenderable} from '../../../api/IRenderable';

/**
 * Implementation of the 'row' markup element.
 */
export class Row implements IRenderable {

    public spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const row = document.createElement('tr');
        row.classList.add('row');

        const elements = (this.spec.elements || []).map(e => renderer.render(e, "row"));
        elements.forEach(e => e.forEach(x => row.appendChild(x)));

        return row;
    }

}
