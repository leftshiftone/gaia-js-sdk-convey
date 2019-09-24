import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'container' type markup element.
 * The container markup element is always the top element
 * of each process step.
 *
 * A div HTML element is created and the class lto-container
 * is added to allow CSS manipulations. Additionally, if the
 * rendered markup elements contains the class lto-suggestions
 * a suggestion element is crated.
 *
 * @see {@link Suggestion}
 * @see {@link IRenderable}
 */
export class Container implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-container");

        const elements = (this.spec.elements || []).map(e => renderer.render(e));
        elements.forEach(e => e.forEach(x => div.appendChild(x)));

        const suggestions = div.querySelectorAll(".lto-suggestion");
        suggestions.forEach(suggestion => {
            div.removeChild(suggestion);
            renderer.appendSuggest(suggestion as HTMLElement);
        });

        return div;
    }

}
Renderables.register("container", Container);
