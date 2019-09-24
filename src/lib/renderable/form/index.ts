import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'form' markup element.
 * A form HTML element is created and the class
 * lto-form is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link IStackeable}
 * @see {@link Submit}
 */
export class Form implements IRenderable, IStackeable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const form = document.createElement('form');
        form.setAttribute("name", this.spec.name || "");
        form.classList.add('lto-form', "lto-" + position);

        if (this.spec.id !== undefined) {
            form.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => form.classList.add(e));
        }

        form.appendChild(Timestamp.render());

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => form.appendChild(x)));

        if (isNested) {
            form.classList.add('lto-nested');
        }
        return form;
    }
}

Renderables.register("form", Form);
