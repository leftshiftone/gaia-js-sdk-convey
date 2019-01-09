import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer, ISpecification} from '../../api/IRenderer';

export class Image extends AbstractRenderable {

    private readonly spec:ISpecification;

    constructor(spec: ISpecification) {
        super('image');
        this.spec = spec;
    }

    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const image = document.createElement('img');
        image.setAttribute('src', this.spec.source || "");
        image.setAttribute('alt', this.spec.text || "");
        image.setAttribute('width', this.spec.width || "auto");
        image.setAttribute('height', this.spec.height || "auto");
        image.classList.add('image');

        return image;
    }

}
