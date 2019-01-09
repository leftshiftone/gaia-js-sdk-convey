import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'button' markup element.
 */
export class Button implements IRenderable {

    private readonly message: ISpecification;

    constructor(message: ISpecification) {
        this.message = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.message.position || 'left';
        const button = document.createElement('button');
        button.setAttribute('name', this.message.name || "");

        button.classList.add(isNested ? "button-nested" : "button", position);
        button.appendChild(document.createTextNode(this.message.text || ""));

        button.addEventListener('click', () => {
            const text = this.message.text || "";
            const name = this.message.name || "";
            const value = this.message.value || "";

            EventStream.emit("GAIA::publish", {text, type: 'button', attributes: {name, value, type: 'button'}});
        });

        return button;
    }

    public getPosition = () => this.message.position || "left";

    public name = () => "button";

}
