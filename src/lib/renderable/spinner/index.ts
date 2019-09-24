import {IRenderer, ISpecification,IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'spinner' markup element.
 * A HTML input element where attribute type is set to number.
 * The class lto-spinner is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 */
export class Spinner implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const spinner = document.createElement('input');
        spinner.setAttribute("type", "number");
        // @ts-ignore
        spinner.setAttribute('value', isNaN(this.spec.value) ? "" : this.spec.value);
        // @ts-ignore
        spinner.setAttribute('min', isNaN(this.spec.min) ? "" : this.spec.min);
        // @ts-ignore
        spinner.setAttribute('max', isNaN(this.spec.max) ? "" : this.spec.max);
        spinner.setAttribute('step', this.spec.step || "");
        spinner.setAttribute('name', this.spec.name || "");

        spinner.addEventListener("change", () => {
            spinner.setAttribute('value', spinner.value);
        });

        spinner.classList.add("lto-spinner", "lto-" + position);
        if (this.spec.id !== undefined) {
            spinner.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => spinner.classList.add(e));
        }

        spinner.step = this.spec.step || "";

        if (isNested) {
            spinner.classList.add("lto-nested");
        }

        return spinner;
    }
}

Renderables.register("spinner", Spinner);
