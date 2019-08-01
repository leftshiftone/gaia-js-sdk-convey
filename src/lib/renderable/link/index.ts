import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'link' markup element.
 */
export class Link implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const link = document.createElement('a');
        link.setAttribute('href', Link.decode(this.spec.value || ""));
        link.setAttribute('target', '_blank');
        link.classList.add('lto-link');
        if (this.spec.id !== undefined) {
            link.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => link.classList.add(e));
        }
        link.appendChild(document.createTextNode(this.spec.text || ""));

        return link;
    }

    private static decode(input:string) {
        var txt = document.createElement("textarea");
        txt.innerHTML = input;
        return txt.value;
    }

}
Renderables.register("link", Link);
