import {IRenderer, IRenderable, ISpecification} from '../../api';
import node from "../../support/node";
import Renderables from "../Renderables";

/**
 * Implementation of the 'overlay' markup element.
 */
export class Overlay implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const overlay = node("div");
        overlay.addClasses("lto-overlay", "lto-inactive");
        this.spec.class !== undefined ? overlay.addClasses(this.spec.class) : () => {};
        if(this.spec.id)
            overlay.addAttributes({
                id: this.spec.id
            });
        overlay.addAttributes({
            name: this.spec.trigger!
        });

        const close = node("div");
        close.addClasses("lto-close-overlay");

        overlay.appendChild(close);

        close.onClick(() => {
            overlay.addClasses("lto-inactive")
        });

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => overlay.appendChild(node(x as HTMLElement))));

        return overlay.unwrap();
    }

}

Renderables.register("overlay", Overlay);
