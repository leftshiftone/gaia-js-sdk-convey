import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'slider' markup element.
 */
export class Slider implements IRenderable {

    private readonly spec: ISpecification;

    private container = document.createElement("div");
    private slider = document.createElement("input");

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';

        const minLabel = document.createElement("span");
        const maxLabel = document.createElement("span");
        const values: Map<number, string> = new Map();

        this.slider.type = "range";
        this.slider.name = this.spec.name || "";

        minLabel.classList.add("lto-slider-min");
        maxLabel.classList.add("lto-slider-max");

        const value = document.createElement("div");
        value.classList.add("lto-slider-value");
        const valueContent = document.createElement("span");
        value.appendChild(valueContent);

        if (this.spec.values) {
            this.slider.max = (this.spec.values.length - 1).toString();
            this.slider.min = "0";
            this.slider.value = this.spec.value || "0";
            this.slider.step = "1";
            this.spec.values.forEach(value => values.set(this.spec.values!.indexOf(value), value));

            this.setSliderMinMaxClass();

            minLabel.innerText = values.get(+this.slider.min)!.toString();
            maxLabel.innerText = values.get(+this.slider.max)!.toString();

            valueContent.innerHTML = values.get(+this.slider.value)!;
            this.slider.setAttribute("value", values.get(+this.slider.value)!);

            const onChange = () => {
                this.setSliderMinMaxClass();
                this.slider.setAttribute("value", values.get(+this.slider.value)!);
                valueContent.innerHTML = values.get(+this.slider.value)!;
            };

            this.slider.oninput = onChange;
            //ie11 compatibility
            this.slider.onchange = onChange;
        } else {
            //@ts-ignore
            this.slider.value = isNaN(this.spec.value) ? "" : this.spec.value;
            //@ts-ignore
            this.slider.min = isNaN(this.spec.min) ? "" : this.spec.min;
            //@ts-ignore
            this.slider.max = isNaN(this.spec.max) ? "" : this.spec.max;
            this.slider.step = this.spec.step || "";
            minLabel.innerText = this.slider.min;
            maxLabel.innerText = this.slider.max;

            this.setSliderMinMaxClass();

            valueContent.innerHTML = this.slider.value;
            this.slider.setAttribute("value", this.slider.value);
            const onChange = () => {
                this.setSliderMinMaxClass();
                this.slider.setAttribute("value", this.slider.value);
                valueContent.innerHTML = this.slider.value;
            };
            this.slider.oninput = onChange;
            //ie11 compatibility
            this.slider.onchange = onChange;
        }

        this.slider.classList.add("lto-slider", "lto-" + position);

        if (!this.spec.horizontal) {
            this.slider.style.transform = "rotate(90deg)";
        }

        if (isNested) {
            this.slider.classList.add("lto-nested");
        }

        this.container.classList.add("lto-slider-container");
        if (this.spec.class) {
            this.spec.class.split(" ").forEach(e => this.container.classList.add(e));
        }

        this.slider.appendChild(document.createTextNode(this.spec.text || ""));

        this.container.appendChild(value);
        this.container.appendChild(minLabel);
        this.container.appendChild(this.slider);
        this.container.appendChild(maxLabel);

        return this.container;
    }

    public setSliderMinMaxClass() {
        this.container.classList.remove("lto-slider-value-max", "lto-slider-value-min", "lto-slider-value-one");
        if (this.slider.value === this.slider.max) {
            this.container.classList.add("lto-slider-value-max");
        }
        if (this.slider.value === this.slider.min) {
            this.container.classList.add("lto-slider-value-min");
        }
        if (this.slider.value === "1") {
            this.container.classList.add("lto-slider-value-one");
        }
    }

}

Renderables.register("slider", Slider);
