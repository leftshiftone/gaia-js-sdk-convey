import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

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
        const position = this.spec.position || 'left';
        const text = document.createElement('div');
        if(this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => text.classList.add(e));

        text.classList.add('lto-text', "lto-" + position);
        text.appendChild(document.createTextNode(this.spec.text || ""));

        if (!isNested) {
            text.appendChild(Timestamp.render());
            const div = document.createElement("div");
            div.appendChild(new Icon(position).render());
            div.appendChild(text);
            return div;
        } else
            text.classList.add('lto-nested');

        return text;

    }

}
Renderables.register("text", Text);
