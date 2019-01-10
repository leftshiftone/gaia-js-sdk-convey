import {Timestamp} from '../timestamp';
import {Icon} from '../icon';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'items' markup element.
 */
export class Items implements IRenderable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        if (!isNested) {
            const div = document.createElement('div');
            div.classList.add('lto-items');
            div.appendChild(Timestamp.render());

            const items = document.createElement('ul');
            div.appendChild(items);

            const elements = (this.spec.elements || []).map(e => renderer.render(e, "items"));
            elements.forEach(e => e.forEach(x => items.appendChild(x)));
            div.appendChild(new Icon(this.spec.position || 'left').render());

            return div;
        }
        const items = document.createElement('ul');
        const elements = (this.spec.elements || []).map(e => renderer.render(e, "items"));
        elements.forEach(e => e.forEach(x => items.appendChild(x)));

        return items;
    }

}
