import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

/**
 * Implementation of the 'item' markup element.
 * A li HTML element is created and the class lto-item
 * is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link Items}
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
        const item = node("li");
        item.setId(this.spec.id);
        item.addClasses("lto-item", "lto-left");
        this.spec.class !== undefined ? item.addClasses(this.spec.class) : () => {};
        (this.spec.elements || []).map(e => renderer.render(e, this))
            .forEach(e => e.forEach(x => item.appendChild(node(x as HTMLElement))));
        item.unwrap().appendChild(document.createTextNode(this.spec.text || ""));
        return item.unwrap();
    }

}

Renderables.register("item", Item);
