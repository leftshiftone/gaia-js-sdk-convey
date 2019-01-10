import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'item' markup element.
 */
export class Item implements IRenderable {

    private spec:ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const item = document.createElement('li');
        item.classList.add('lto-item');
        item.appendChild(document.createTextNode(this.spec.text || ""));

        return item;
    }

}
