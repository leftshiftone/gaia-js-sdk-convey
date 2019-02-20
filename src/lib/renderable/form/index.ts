import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';

/**
 * Implementation of the 'form' markup element.
 */
export class Form implements IRenderable, IStackeable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const form = document.createElement('form');
        form.setAttribute("name", this.spec.name || "");
        form.classList.add('lto-form', "lto-" + position);

        if(this.spec.class !== undefined) {
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
