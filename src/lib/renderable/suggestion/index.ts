import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {split} from '../../support/Strings';

/**
 * Implementation of the 'suggestion' markup element.
 */
export class Suggestion implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const button = document.createElement('button');
        button.setAttribute('name', this.spec.name || "");

        button.classList.add("lto-suggestion", "lto-" + position);
        split(this.spec.class).forEach((e:string) => button.classList.add(e));

        if (isNested) {
            button.classList.add("lto-nested");
        }
        button.appendChild(document.createTextNode(this.spec.text || ""));

        if (position === "left") {
            button.addEventListener('click', () => {
                // remove left buttons
                const elements = document.querySelectorAll('.lto-suggestion.lto-left');
                elements.forEach(element => element.remove());

                EventStream.emit("GAIA::publish", {
                        type: 'suggestion',
                        text: this.spec.text || "",
                        attributes: {type: 'suggestion', name: this.spec.name || "", value: this.spec.value || ""}
                    },
                );
            }, {once: true});
        }

        return button;
    }

}
Renderables.register("suggestion", Suggestion);
