import {IRenderable, IRenderer, ISpecification, IStackeable} from "../../api";
import Renderables from "../Renderables";

/**
 * Implementation of the 'transition' type markup element.
 */
export class Transition implements IRenderable, IStackeable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const div = document.createElement('div');
        div.classList.add("lto-transition");

        div.setAttribute("wrapped", this.spec.wrapped || "in");
        div.setAttribute("direction", this.spec.direction || "down");

        const elements = (this.spec.elements || []).map(e => renderer.render(e));
        elements.forEach(e => e.forEach(x => div.appendChild(x)));

        const suggestions = div.querySelectorAll(".lto-suggestion");
        suggestions.forEach(suggestion => {
            div.removeChild(suggestion);
            renderer.appendSuggest(suggestion as HTMLElement);
        });

        if (isNested) {
            div.classList.add("lto-nested");
        }

        return div;
    }

}
Renderables.register("transition", Transition);
