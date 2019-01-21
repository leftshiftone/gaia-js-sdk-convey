import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'button' markup element.
 */
export class Button implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const button = document.createElement('button');
        button.setAttribute('name', this.spec.name || "");
        if (this.spec.class !== undefined) button.classList.add(this.spec.class);
        button.classList.add("lto-button", "lto-" + position);
        if (isNested) {
            button.classList.add("lto-nested");
        }
        button.appendChild(document.createTextNode(this.spec.text || ""));

        if (position === "left") {
            const eventListener = () => {
                const text = this.spec.text || "";
                const name = this.spec.name || "";
                const value = this.spec.value || "";

                EventStream.emit("GAIA::publish", {text, type: 'button', attributes: {name, value, type: 'button'}});
            };
            button.addEventListener('click', eventListener, {once: true});
        }
        return button;
    }

    public getPosition = () => this.spec.position || "left";

}
