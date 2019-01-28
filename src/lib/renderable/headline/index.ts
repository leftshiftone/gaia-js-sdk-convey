import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'headline' markup element.
 */
export class Headline implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const position = this.spec.position || 'left';
        const headline = document.createElement('h2');
        if (this.spec.class !== undefined) headline.classList.add(this.spec.class);
        headline.classList.add('lto-headline', position);
        headline.appendChild(document.createTextNode(this.spec.text || ""));

        return headline;
    }

}
Renderables.register("headline", Headline);
