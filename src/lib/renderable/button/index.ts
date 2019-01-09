import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';

/**
 * Implementation of the 'button' markup element.
 */
export class Button extends AbstractRenderable {

    private readonly message: ISpecification;

    constructor(message: ISpecification) {
        super('button');
        this.message = message;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.message.position || 'left';
        const button = document.createElement('button');
        button.setAttribute('name', this.message.name || "");

        if (!isNested) {
            button.classList.add('button', position);
        } else {
            button.classList.add('button-nested', position);
        }
        button.appendChild(document.createTextNode(this.message.text || ""));

        button.addEventListener('click', () => {
            const text = this.message.text || "";
            const name = this.message.name || "";
            const value = this.message.value || "";

            EventStream.emit("GAIA::publish", {text, type: 'button', attributes: {name, value, type: 'button'}});
        });

        return button;
    }

    public getPosition() {
        return this.message.position || "left";
    }

}
