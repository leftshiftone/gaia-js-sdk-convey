import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'image' markup element.
 */
export class Image implements IRenderable {

    private readonly spec:ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const image = document.createElement('img');
        image.setAttribute('src', this.spec.source || "");
        image.setAttribute('alt', this.spec.text || "");
        image.setAttribute('width', this.spec.width || "auto");
        image.setAttribute('height', this.spec.height || "auto");
        image.classList.add('lto-image');

        return image;
    }

}
