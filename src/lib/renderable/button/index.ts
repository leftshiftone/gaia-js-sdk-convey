import {IRenderer, ISpecification} from '../../api/IRenderer';
import EventStream from '../../event/EventStream';
import {removeAllEventListeners} from "../../support/Elements";
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

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
        if (this.spec.id !== undefined) {
            button.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => button.classList.add(e));
        }
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

                const buttonObject = {text, type: 'button', attributes: {name, value, type: 'button'}};
                EventStream.emit("GAIA::publish", buttonObject);

                // remove left buttons
                const buttons = document.querySelectorAll('.lto-button.lto-left');
                buttons.forEach(element => {
                    if (element.classList.contains("lto-persistent")) {
                        removeAllEventListeners(element);
                    } else {
                        element.remove()
                    }
                });

                // remove left submits
                const submits = document.querySelectorAll('.lto-submit.lto-left');
                submits.forEach(element => {
                    if (!element.classList.contains("lto-persistent")) element.remove()
                });

                // remove left suggestions
                const suggestions = document.querySelectorAll('.lto-suggestion.lto-left');
                suggestions.forEach(element => element.remove());

                // add right button
                const newButton = Object.assign(buttonObject, {
                    class: this.spec.class,
                    position: 'right',
                    timestamp: new Date().getTime()
                });
                renderer.render({type: "container", elements: [newButton]}).forEach(e => renderer.appendContent(e));
            };
            button.addEventListener('click', eventListener, {once: true});
        }
        return button;
    }

}

Renderables.register("button", Button);
