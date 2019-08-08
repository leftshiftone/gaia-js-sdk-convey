import {IRenderer, IRenderable, ISpecification} from '../../api';
import node from "../../support/node";
import Renderables from "../Renderables";

/**
 * Implementation of the 'overlays' markup element.
 */
export class Overlays implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const overlays = node("div");
        overlays.addClasses("lto-overlays");
        this.spec.class !== undefined ? overlays.addClasses(this.spec.class) : () => {};
        if(this.spec.id)
            overlays.addAttributes({
                id: this.spec.id
            });

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => overlays.appendChild(node(x as HTMLElement))));

        return overlays.unwrap();
    }

}

Renderables.register("overlays", Overlays);
