import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

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
        const slider = document.createElement("input");
        slider.type="range";
        //@ts-ignore
        slider.value = isNaN(this.spec.value) ? "" : this.spec.value;
        //@ts-ignore
        slider.min = isNaN(this.spec.min) ? "" : this.spec.min;
        //@ts-ignore
        slider.max = isNaN(this.spec.max) ? "" : this.spec.max;
        slider.step = this.spec.step || "";
        slider.name = this.spec.name || "";

        const value = document.createElement("div");
        value.classList.add("lto-slider-value");

        value.innerHTML = slider.value;

        slider.oninput = () => {
            slider.setAttribute('value', slider.value);
            value.innerHTML = slider.value;
        };

        slider.classList.add("lto-slider", "lto-" + position);

        if (!this.spec.horizontal) {
            slider.style.transform = "rotate(90deg)";
        }

        slider.step = this.spec.step || "";

        if (isNested) { slider.classList.add("lto-nested") }

        const container = document.createElement("div");
        container.classList.add("lto-slider-container");
        if(this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => container.classList.add(e));
        }

        slider.appendChild(document.createTextNode(this.spec.text || ""));

        container.appendChild(value);
        container.appendChild(slider);

        return container;
    }
}

Renderables.register("slider", Slider);
