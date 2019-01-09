import {AbstractRenderable} from '../../AbstractRenderable';
import {IRenderer, ISpecification} from '../../../api/IRenderer';

/**
 * Implementation of the 'row' markup element.
 */
export class Row extends AbstractRenderable {

    public spec: ISpecification;

    constructor(message: ISpecification) {
        super('row');
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const row = document.createElement('tr');
        row.classList.add('row');

        const elements = renderer.render(this.spec, false);
        elements.forEach(row.appendChild);

        return row;
    }

}
