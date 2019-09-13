import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'image' markup element.
 * An img HTML element is created and the given
 * attributes src, alt, with and height are taken over.
 * The class lot-image is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 */
export class Image implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const image = document.createElement('img');
        image.setAttribute('src', this.spec.src || "");
        image.setAttribute('alt', this.spec.text || "");
        image.setAttribute('width', this.spec.width || "auto");
        image.setAttribute('height', this.spec.height || "auto");
        image.classList.add('lto-image', "lto-" + (this.spec.position || 'left'));
        if (this.spec.id !== undefined) {
            image.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => image.classList.add(e));
        }

        return image;
    }

}

Renderables.register("image", Image);
