import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'spinner' markup element.
 */
export class Spinner implements IRenderable {

    private readonly message: ISpecification;

    constructor(message: ISpecification) {
        this.message = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.message.position || 'left';
        const spinner = document.createElement('input');

        spinner.setAttribute("type", "number")
        spinner.setAttribute('value', this.message.value || "");
        spinner.setAttribute('min', this.message.min || "");
        spinner.setAttribute('max', this.message.max || "");
        spinner.setAttribute('step', this.message.step || "");
        spinner.setAttribute('name', this.message.name || "");

        spinner.classList.add("lto-spinner", "lto-" + position);

        spinner.step = this.message.step || "";

        if (isNested) { spinner.classList.add("lto-nested") }

        return spinner;
    }
}
