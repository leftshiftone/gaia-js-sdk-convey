import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer, ISpecification} from '../../api/IRenderer';

export class Headline extends AbstractRenderable {

    private readonly message: ISpecification;

    constructor(message: ISpecification) {
        super('headline');
        this.message = message;
    }

    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const position = this.message.position || 'left';
        const headline = document.createElement('h2');
        headline.classList.add('headline', position);
        headline.appendChild(document.createTextNode(this.message.text || ""));

        return headline;
    }

}
