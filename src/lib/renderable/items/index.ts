import {AbstractRenderable} from '../AbstractRenderable';
import {Timestamp} from '../timestamp';
import {Icon} from '../icon';
import {IRenderer, ISpecification} from '../../api/IRenderer';

/**
 * Implementation of the 'items' markup element.
 */
export class Items extends AbstractRenderable {

    public spec: ISpecification;

    constructor(message: ISpecification) {
        super('items');
        this.spec = message;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        if (!isNested) {
            const div = document.createElement('div');
            div.classList.add('items');
            div.appendChild(Timestamp.render());

            const items = document.createElement('ul');
            div.appendChild(items);

            const elements = renderer.render(this.spec, false);
            elements.forEach(items.appendChild);
            div.appendChild(new Icon(this.spec.position || 'left').render());

            return div;
        }
        const items = document.createElement('ul');
        const elements = renderer.render(this.spec, false);
        elements.forEach(items.appendChild);

        return items;
    }

}
