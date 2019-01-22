import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'spinner' markup element.
 */
export class Spinner implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const spinner = document.createElement('input');

        spinner.setAttribute("type", "number")
        spinner.setAttribute('value', this.spec.value || "");
        spinner.setAttribute('min', this.spec.min || "");
        spinner.setAttribute('max', this.spec.max || "");
        spinner.setAttribute('step', this.spec.step || "");
        spinner.setAttribute('name', this.spec.name || "");

        spinner.addEventListener("change", () => {
            spinner.setAttribute('value', spinner.value);
        })

        spinner.classList.add("lto-spinner", "lto-" + position);
        if (this.spec.class !== undefined) spinner.classList.add(this.spec.class);

        spinner.step = this.spec.step || "";

        if (isNested) { spinner.classList.add("lto-nested") }

        return spinner;
    }
}
