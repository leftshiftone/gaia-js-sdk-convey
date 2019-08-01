import {Timestamp} from '../timestamp';
import {Icon} from '../icon';
import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'items' markup element.
 */
export class Items implements IRenderable, IStackeable {

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
            if (this.spec.id !== undefined) {
                div.id = this.spec.id;
            }
            if (this.spec.class !== undefined) {
                this.spec.class.split(" ").forEach(e => div.classList.add(e));
            }
            div.appendChild(Timestamp.render());

            const items = document.createElement('ul');
            div.appendChild(items);

            const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
            elements.forEach(e => e.forEach(x => items.appendChild(x)));
            div.appendChild(new Icon(this.spec.position || 'left').render());

            return div;
        }
        const items = document.createElement('ul');
        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => items.classList.add(e));

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => items.appendChild(x)));

        return items;
    }

}

Renderables.register("items", Items);
