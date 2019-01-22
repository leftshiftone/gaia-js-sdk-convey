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

        button.classList.add("lto-button", "lto-" + position);
        if (isNested) {
            button.classList.add("lto-nested");
        }
        button.appendChild(document.createTextNode(this.message.text || ""));

        if (position === "left") {
            const eventListener = () => {
                const text = this.message.text || "";
                const name = this.message.name || "";
                const value = this.message.value || "";

                const button = {text, type: 'button', attributes: {name, value, type: 'button'}};
                EventStream.emit("GAIA::publish", button);

                // remove left buttons
                const elements = document.querySelectorAll('.lto-button.lto-left');
                elements.forEach(element => element.remove());

                // remove left submits
                const submits = document.querySelectorAll('.lto-submit.lto-left');
                submits.forEach(element => element.remove());

                // remove left suggestions
                const suggestions = document.querySelectorAll('.lto-suggestion.lto-left');
                suggestions.forEach(element => element.remove());

                // add right button
                const newButton = Object.assign(button, {position: 'right', timestamp: new Date().getTime()});
                renderer.render({type: "container", elements: [newButton]}).forEach(e => renderer.append(e));
            };
            button.addEventListener('click', eventListener, {once: true});
        }
        return button;
    }

    public getPosition = () => this.message.position || "left";

}
