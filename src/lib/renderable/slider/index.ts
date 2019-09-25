import {IRenderable, IRenderer, ISpecification} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'slider' markup element.
 * A input HTML element of type range is used to create a
 * slider element. The classes lto-slider-min, lto-slider-max,
 * lto-slider-value and lto-slider-step and their values
 * are taken over from the markup. The slider anchors is an
 * additional possibility to control the slider and can
 * be accessed using the lto-slider-prev and lto-slider-next
 * classes.
 *
 * @see {@link IRenderable}
 */
export class Slider implements IRenderable {

    private readonly spec: ISpecification;

    private container = document.createElement("div");
    private slider: HTMLInputElement = document.createElement("input");

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * @inheritDoc
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

        let prevButton: HTMLAnchorElement;
        let nextButton: HTMLAnchorElement;

        //@ts-ignore
        this.slider.value = isNaN(this.spec.value) ? "" : this.spec.value;
        //@ts-ignore
        this.slider.min = isNaN(this.spec.min) ? "" : this.spec.min;
        //@ts-ignore
        this.slider.max = isNaN(this.spec.max) ? "" : this.spec.max;
        this.slider.step = this.spec.step || "";

        let initialValue: string = this.slider.value;
        let minValue: string = this.slider.min;
        let maxValue: string = this.slider.max;
        let onChange = () => {
            this.setSliderMinMaxClass();
            this.slider.setAttribute("value", this.slider.value);
            valueContent.innerHTML = this.slider.value;
        };
        let prevClick = () => {
            if (parseFloat(this.slider.value) !== parseFloat(this.slider.min) && this.slider.getAttribute("value") !== undefined) {
                this.updateValue(String(parseFloat(this.slider.value) - parseFloat(this.slider.step)));
            }
        };
        let nextClick = () => {
            if (parseFloat(this.slider.value) ! <= parseFloat(this.slider.max) && this.slider.getAttribute("value") !== undefined) {
                this.updateValue(String(parseFloat(this.slider.value) + parseFloat(this.slider.step)));
            }
        };

        if (this.spec.values) {
            this.slider.value = this.spec.value || "0";
            this.slider.min = "0";
            this.slider.max = (this.spec.values.length - 1).toString();
            this.slider.step = "1";
            this.spec.values.forEach(value => values.set(this.spec.values!.indexOf(value), value));

            initialValue = values.get(+this.slider.value)!;
            minValue = values.get(+this.slider.min)!.toString();
            maxValue = values.get(+this.slider.max)!.toString();
            onChange = () => {
                valueContent.innerHTML = values.get(+this.slider.value)!;
                this.slider.setAttribute("value", values.get(+this.slider.value)!);
                this.setSliderMinMaxClass();
            };
            prevClick = () => {
                if (parseInt(this.slider.value) - 1 ! >= 0) {
                    const index = parseInt(this.slider.value) - 1;
                    this.updateValue(index.toString())
                }
            };
            nextClick = () => {
                if (parseInt(this.slider.value) + 1 ! <= values.size - 1) {
                    const index = parseInt(this.slider.value) + 1;
                    this.updateValue(index.toString());
                }
            };
        }

        minLabel.innerText = minValue;
        maxLabel.innerText = maxValue;
        this.slider.setAttribute("value", initialValue);
        valueContent.innerHTML = initialValue;
        this.slider.oninput = onChange;
        this.slider.onchange = onChange; // ie11 compatibility

        this.setSliderMinMaxClass();
        [prevButton, nextButton] = Slider.createSliderButtons();
        prevButton.addEventListener("click", prevClick);
        nextButton.addEventListener("click", nextClick);

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

        controls.appendChild(prevButton);
        controls.appendChild(this.slider);
        controls.appendChild(nextButton);
        this.container.appendChild(controls);
        this.container.appendChild(maxLabel);

        return this.container;
    }

    private static createSliderButtons(): HTMLAnchorElement [] {
        const prevButton = document.createElement("a");
        prevButton.classList.add("lto-slider-prev");
        const prevSpan = document.createElement("span");
        prevSpan.innerText = "←";
        prevButton.appendChild(prevSpan);

        const nextButton = document.createElement("a");
        nextButton.classList.add("lto-slider-next");
        const nextSpan = document.createElement("span");
        nextSpan.innerText = "→";
        nextButton.appendChild(nextSpan);

        return [prevButton, nextButton];
    }

    private updateValue(value: string) {
        this.slider.value = value;
        this.slider.dispatchEvent(new Event("input"));
        this.slider.dispatchEvent(new Event("change")); // ie11 compatibility
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
