import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'container' type markup element.
 */
export class Container implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("container");

        const elements = (this.spec.elements || []).map(e => renderer.render(e, "container"));
        elements.forEach(e => e.forEach(x => div.appendChild(x)));

        return div;
    }

}
