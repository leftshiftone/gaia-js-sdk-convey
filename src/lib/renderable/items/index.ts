import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

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
