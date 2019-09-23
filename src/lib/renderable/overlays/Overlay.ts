import {IRenderer, IRenderable, ISpecification} from '../../api';
import node, {INode} from "../../support/node";
import Renderables from "../Renderables";

/**
 * Implementation of the 'overlay' markup element.
 * A HTML div element which can contain several markup elements.
 * An overlay will be triggered by clicking on the associated 'trigger' element
 * For CSS manipulations the following classes are added:
 *  lto-overlay: the overlay element
 *
 * @see {@link IRenderable}
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
        overlay.setId(this.spec.id);
        overlay.setName(this.spec.trigger);
        overlay.addClasses("lto-overlay");
        this.spec.class !== undefined ? overlay.addClasses(this.spec.class) : () => {};

        const close = node("div");
        close.addClasses("lto-close-overlay");
        close.onClick(() => Overlay.hide(overlay));
        overlay.appendChild(close);

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => overlay.appendChild(node(x as HTMLElement))));

        Overlay.hide(overlay);

        return overlay.unwrap();
    }

    public static hide(overlay: INode) {
        overlay.addClasses("lto-inactive")
    }

    public static show(overlay: INode) {
        overlay.removeClasses("lto-inactive")
    }

}

Renderables.register("overlay", Overlay);
