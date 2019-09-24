import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

/**
 * Implementation of the 'items' markup element.
 * An ol or ul HTML element is created depending if
 * the items of the item section requires ordering.
 * The attribute id of the markup is applied and the
 * class lto-items is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link IStackeable}
 * @see {@link Item}
 */
export class Items implements IRenderable, IStackeable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const items = node(this.spec.ordered ? "ol" : "ul");
        items.setId(this.spec.id)
        items.addClasses("lto-items", "lto-left");
        this.spec.class !== undefined ? items.addClasses(this.spec.class) : () => {};
        (this.spec.elements || []).map(e => renderer.render(e, this))
            .forEach(e => e.forEach(x => items.appendChild(node(x as HTMLElement))));
        if (isNested)
            items.addClasses("lto-nested");

        return items.unwrap();
    }
}

Renderables.register("items", Items);
