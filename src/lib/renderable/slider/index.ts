import {IRenderer, ISpecification,IRenderable} from '../../api';
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

        let sliderAnchors : HTMLAnchorElement [];

        if (this.spec.values) {
            this.slider.max = (this.spec.values.length - 1).toString();
            this.slider.min = "0";
            this.slider.value = this.spec.value || "0";
            this.slider.step = "1";
            this.spec.values.forEach(value => values.set(this.spec.values!.indexOf(value), value));

            this.setSliderMinMaxClass();

            minLabel.innerText = values.get(+this.slider.min)!.toString();
            maxLabel.innerText = values.get(+this.slider.max)!.toString();

            this.slider.setAttribute("value", values.get(+this.slider.value)!);
            valueContent.innerHTML = values.get(+this.slider.value)!;

            const onChange = () => {
                valueContent.innerHTML = values.get(+this.slider.value)!;
                this.slider.setAttribute("value", values.get(+this.slider.value)!);
                this.setSliderMinMaxClass();
            };

            this.slider.oninput = onChange;
            //ie11 compatibility
            this.slider.onchange = onChange;
            sliderAnchors = this.createSliderAnchors();

            sliderAnchors[0].addEventListener("click", () => {
                if (parseInt(this.slider.value)-1 !>= 0) {
                    const index = parseInt(this.slider.value)-1;
                    this.slider.value = index.toString();
                    this.slider.setAttribute("value", values.get(index)!!);
                    valueContent.innerHTML = values.get(index)!;
                }
            });

            sliderAnchors[1].addEventListener("click", () => {
                if (parseInt(this.slider.value)+1 !<= values.size-1) {
                    const index = parseInt(this.slider.value)+1;
                    this.slider.value = index.toString();
                    this.slider.setAttribute("value", values.get(index)!!);
                    valueContent.innerHTML = values.get(index)!;
                }
            });

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

            sliderAnchors = this.createSliderAnchors();

            sliderAnchors[0].addEventListener("click", () => {
                if (this.slider.getAttribute("value") !== this.slider.min && this.slider.getAttribute("value") !== undefined) {
                    const newSliderValue = String(parseFloat(this.slider.value)-parseFloat(this.slider.step));
                    this.slider.setAttribute("value", newSliderValue);
                    this.slider.value = newSliderValue;
                    valueContent.innerHTML = this.slider.value;
                }
            });

            sliderAnchors[1].addEventListener("click", () => {
                if (this.slider.getAttribute("value") !== this.slider.min && this.slider.getAttribute("value") !== undefined) {
                    const newSliderValue = String(parseFloat(this.slider.value)+parseFloat(this.slider.step));
                    this.slider.setAttribute("value", newSliderValue);
                    this.slider.value = newSliderValue;
                    valueContent.innerHTML = this.slider.value;
                }
            });
        }

        this.slider.classList.add("lto-slider", "lto-" + position);

        if (!this.spec.horizontal) {
            this.slider.style.transform = "rotate(90deg)";
        }

        if (isNested) {
            this.slider.classList.add("lto-nested");
        }

        this.container.classList.add("lto-slider-container");
        if (this.spec.id !== undefined) {
            this.container.id = this.spec.id;
        }
        if (this.spec.class) {
            this.spec.class.split(" ").forEach(e => this.container.classList.add(e));
        }

        this.slider.appendChild(document.createTextNode(this.spec.text || ""));

        const controls = document.createElement("div");
        controls.classList.add("lto-slider-controls");

        this.container.appendChild(value);
        this.container.appendChild(minLabel);

        controls.appendChild(sliderAnchors[0]);
        controls.appendChild(this.slider);
        controls.appendChild(sliderAnchors[1]);
        this.container.appendChild(controls);
        this.container.appendChild(maxLabel);

        return this.container;
    }

    private createSliderAnchors() : HTMLAnchorElement [] {
        const prevLink = document.createElement("a");
        prevLink.classList.add("lto-slider-prev");
        const prevSpan = document.createElement("span");
        prevSpan.innerText = "←";
        prevLink.appendChild(prevSpan);

        const nextLink = document.createElement("a");
        nextLink.classList.add("lto-slider-next");
        const nextSpan = document.createElement("span");
        nextSpan.innerText = "→";
        nextLink.appendChild(nextSpan);

        return [prevLink, nextLink];
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
