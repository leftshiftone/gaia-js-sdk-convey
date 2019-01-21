import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {IRenderable} from '../../api/IRenderable';

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
        const button = document.createElement('button');
        button.setAttribute('name', this.spec.name || "");

        button.classList.add("lto-suggestion", "lto-left");
        if (this.spec.class !== undefined) button.classList.add(this.spec.class);

        if (isNested) {
            button.classList.add("lto-nested");
        }
        button.appendChild(document.createTextNode(this.spec.text || ""));

        if (this.spec.position === "left") {
            button.addEventListener('click', () => {
                EventStream.emit("GAIA::publish", {
                        type: 'button',
                        text: this.spec.text || "",
                        attributes: {type: 'button', name: this.spec.name || "", value: this.spec.value || ""}
                    },
                );
            }, {once: true});
        }

        return button;
    }

}
