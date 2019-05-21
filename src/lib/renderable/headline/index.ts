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
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const headline = document.createElement('h2');
        if (this.spec.id !== undefined) {
            headline.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => headline.classList.add(e));
        }
        headline.classList.add('lto-headline', "lto-" + this.spec.position || 'left');
        headline.appendChild(document.createTextNode(this.spec.text || ""));

        return headline;
    }

}

Renderables.register("headline", Headline);
