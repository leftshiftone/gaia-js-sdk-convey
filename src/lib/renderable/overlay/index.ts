import {IRenderer,IRenderable} from '../../api';

/**
 * Implementation of the 'overlay' markup element.
 * An overlay always has to be a part of an overlays element. A
 * div HTML element is created containing an additional div
 * element for the overlay content and a button for the interaction.
 * The class lto-overlay is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link Overlays}
 */
export class Overlay implements IRenderable {

    private readonly renderable: IRenderable;

    constructor(renderable: IRenderable) {
        this.renderable = renderable;
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-overlay");

        const content = document.createElement("div");
        const button = document.createElement("button");
        button.appendChild(document.createTextNode("x"));
        content.appendChild(button);

        button.addEventListener("click", () => {
            if (div.parentElement) {
                div.parentElement.removeChild(div);
            }
        }, {once: true});

        this.renderable.render(renderer, true).querySelectorAll("*")
            .forEach(e => content.appendChild(e));

        div.appendChild(content);

        return div;
    }

}
