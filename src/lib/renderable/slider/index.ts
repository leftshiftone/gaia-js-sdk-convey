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
        console.log("hallo");
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const slider = document.createElement("input");
        const minLabel = document.createElement("span");
        const maxLabel = document.createElement("span");
        const values: Map<number, string> = new Map([]);

        slider.type="range";
        slider.name = this.spec.name || "";

        minLabel.classList.add("lto-slider-min");
        maxLabel.classList.add("lto-slider-max");

        const value = document.createElement("div");
        value.classList.add("lto-slider-value");

        if(this.spec.values !== undefined) {
            slider.max = (this.spec.values.length - 1).toString();
            slider.min = "0";
            slider.value = this.spec.value || "0";
            slider.step = "1";
            this.spec.values.forEach(value => values.set(this.spec.values!.indexOf(value), value));

            minLabel.innerText = values.get(+slider.min)!.toString();
            maxLabel.innerText = values.get(+slider.max)!.toString();

            value.innerHTML = values.get(+slider.value)!;
            slider.setAttribute('value', values.get(+slider.value)!);

            slider.oninput = () => {
                slider.setAttribute('value', values.get(+slider.value)!);
                value.innerHTML = values.get(+slider.value)!;
            };
        } else {
            //@ts-ignore
            slider.value = isNaN(this.spec.value) ? "" : this.spec.value;
            //@ts-ignore
            slider.min = isNaN(this.spec.min) ? "" : this.spec.min;
            //@ts-ignore
            slider.max = isNaN(this.spec.max) ? "" : this.spec.max;
            slider.step = this.spec.step || "";
            minLabel.innerText = slider.min;
            maxLabel.innerText = slider.max;

            value.innerHTML = slider.value;
            slider.setAttribute('value',slider.value);
            slider.oninput = () => {
                slider.setAttribute('value', slider.value);
                value.innerHTML = slider.value;
            };
        }

        slider.classList.add("lto-slider", "lto-" + position);

        if (!this.spec.horizontal)
            slider.style.transform = "rotate(90deg)";

        if (isNested)
            slider.classList.add("lto-nested");

        const container = document.createElement("div");
        container.classList.add("lto-slider-container");
        if(this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => container.classList.add(e));

        slider.appendChild(document.createTextNode(this.spec.text || ""));

        container.appendChild(value);
        container.appendChild(minLabel);
        container.appendChild(slider);
        container.appendChild(maxLabel);

        return container;
    }
}

Renderables.register("slider", Slider);
