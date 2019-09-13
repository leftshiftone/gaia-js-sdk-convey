import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

/**
 * Implementation of the 'italic' markup element.
 * An i HTML element is created, the attributes id and
 * text from the markup applied and the class
 * lto-italic is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 */
export class Italic implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const italic = node("i");
        italic.addClasses("lto-italic", "lto-left");
        italic.setId(this.spec.id);
        italic.innerText(this.spec.text);
        this.spec.class !== undefined ? italic.addClasses(this.spec.class) : () => {};
        return italic.unwrap();
    }

}

Renderables.register("italic", Italic);
