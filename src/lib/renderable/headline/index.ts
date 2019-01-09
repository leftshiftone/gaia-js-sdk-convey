import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'headline' markup element.
 */
export class Headline implements IRenderable {

    private readonly message: ISpecification;

    constructor(message: ISpecification) {
        this.message = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const position = this.message.position || 'left';
        const headline = document.createElement('h2');
        headline.classList.add('headline', position);
        headline.appendChild(document.createTextNode(this.message.text || ""));

        return headline;
    }

    public name = () => "headline";

}
