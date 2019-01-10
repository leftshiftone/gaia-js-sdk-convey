import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'text' markup element.
 */
export class Text implements IRenderable {

    private readonly spec:ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean): HTMLElement {
        if (!isNested) {
            const position = this.spec.position || 'left';
            const text = document.createElement('div');
            text.classList.add('text', position);
            text.appendChild(Timestamp.render());
            text.appendChild(document.createTextNode(this.spec.text || ""));

            const div = document.createElement("div");
            div.appendChild(new Icon(position).render());
            div.appendChild(text);

            return div;
        }
        const text = document.createElement('div');
        text.appendChild(document.createTextNode(this.spec.text || ""));

        return text;
    }

}
