import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'bold' markup element.
 */
export class Bold implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const bold = document.createElement('b');
        bold.classList.add('lto-bold');
        if (this.spec.class !== undefined) bold.classList.add(this.spec.class);
        bold.appendChild(document.createTextNode(this.spec.text || ""));

        return bold;
    }

}
