import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer, ISpecification} from '../../api/IRenderer';

/**
 * Implementation of the 'bold' markup element.
 */
export class Bold extends AbstractRenderable {

    private readonly message: ISpecification;

    constructor(message: ISpecification) {
        super('bold');
        this.message = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const bold = document.createElement('b');
        bold.classList.add('bold');
        bold.appendChild(document.createTextNode(this.message.text || ""));

        return bold;
    }

}
