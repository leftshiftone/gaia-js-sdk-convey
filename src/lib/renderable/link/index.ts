import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer, ISpecification} from '../../api/IRenderer';

/**
 * Implementation of the 'link' markup element.
 */
export class Link extends AbstractRenderable {

    private readonly spec:ISpecification;

    constructor(spec: ISpecification) {
        super('link');
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested: boolean):HTMLElement {
        const link = document.createElement('a');
        link.setAttribute('href', this.spec.value || "");
        link.setAttribute('target', '_blank');
        link.classList.add('link');
        link.appendChild(document.createTextNode(this.spec.text || ""));

        return link;
    }

}
