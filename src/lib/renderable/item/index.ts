import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'item' markup element.
 */
export class Item implements IRenderable {

    private spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const item = document.createElement('li');
        item.classList.add('lto-item');
        if (this.spec.id !== undefined) {
            item.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => item.classList.add(e));
        }
        item.appendChild(document.createTextNode(this.spec.text || ""));

        return item;
    }

}

Renderables.register("item", Item);
