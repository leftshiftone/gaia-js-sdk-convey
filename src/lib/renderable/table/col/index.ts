import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../../api';
import Renderables from '../../Renderables';

export class Col implements IRenderable, IStackeable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const col = document.createElement('td');
        if(this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => col.classList.add(e));
        }
        col.classList.add('lto-col');

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => col.appendChild(x)));

        return col;
    }

}
Renderables.register("col", Col);
