import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'bold' markup element. A
 * b HTML element is created and the lto-bold class
 * is added to allow CSS modifications.
 *
 * @see {@link IRenderable}
 */
export class Bold implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const bold = document.createElement('b');
        bold.classList.add('lto-bold');
        if (this.spec.id !== undefined) {
            bold.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => bold.classList.add(e));
        }
        bold.appendChild(document.createTextNode(this.spec.text || ""));

        return bold;
    }

}

Renderables.register("bold", Bold);
