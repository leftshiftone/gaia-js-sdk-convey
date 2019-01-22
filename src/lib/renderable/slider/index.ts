import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'slider' markup element.
 */
export class Slider implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const slider = document.createElement('input');

        slider.setAttribute("type", "range")
        slider.setAttribute('value', this.spec.value || "");
        slider.setAttribute('min', this.spec.min || "");
        slider.setAttribute('max', this.spec.max || "");
        slider.setAttribute('step', this.spec.step || "");
        slider.setAttribute('name', this.spec.name || "");

        slider.addEventListener('change', () => {
            slider.setAttribute('value', slider.value);
        });

        slider.classList.add("lto-slider", "lto-" + position);
        if (this.spec.class !== undefined) slider.classList.add(this.spec.class);

        if(!this.spec.horizontal) { slider.style.transform = "rotate(90deg)" }

        slider.step = this.spec.step || "";

        if (isNested) { slider.classList.add("lto-nested") }

        slider.appendChild(document.createTextNode(this.spec.text || ""));

        return slider;
    }
}
