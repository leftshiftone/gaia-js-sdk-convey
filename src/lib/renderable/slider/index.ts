import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'slider' markup element.
 */
export class Slider implements IRenderable {

    private readonly message: ISpecification;

    constructor(message: ISpecification) {
        this.message = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.message.position || 'left';
        const slider = document.createElement('input');

        slider.setAttribute("type", "range")
        slider.setAttribute('value', this.message.value || "");
        slider.setAttribute('min', this.message.min || "");
        slider.setAttribute('max', this.message.max || "");
        slider.setAttribute('step', this.message.step || "");
        slider.setAttribute('name', this.message.name || "");

        slider.classList.add("lto-slider", "lto-" + position);

        if(!this.message.horizontal) { slider.style.transform = "rotate(90deg)" }

        slider.step = this.message.step || "";

        if (isNested) { slider.classList.add("lto-nested") }

        slider.appendChild(document.createTextNode(this.message.text || ""));

        return slider;
    }
}
