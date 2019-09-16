import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'text' markup element.
 * A div HTML element is crated and if the attributes
 * text and icon are set, they are applied.
 * The class lto-text is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link Icon}
 */
export class Text implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const text = document.createElement('div');
        if (this.spec.id !== undefined) {
            text.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => text.classList.add(e));
        }
        text.classList.add('lto-text', "lto-" + position);

        if (!isNested) {
            text.appendChild(Timestamp.render());
            text.appendChild(document.createTextNode(this.spec.text || ""));
            const div = document.createElement("div");
            div.appendChild(new Icon(position).render());
            div.appendChild(text);
            return div;
        }
        text.appendChild(document.createTextNode(this.spec.text || ""));
        text.classList.add('lto-nested');

        return text;

    }

}

Renderables.register("text", Text);
