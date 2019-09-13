import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'headline' markup element.
 * Create a h2 HTML element is created and the class
 * lto-headline is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
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
