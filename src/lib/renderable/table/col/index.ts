import {IRenderer, ISpecification} from '../../../api/IRenderer';
import {IRenderable} from '../../../api/IRenderable';
import Renderables from '../../Renderables';
import {IStackeable} from '../../../api/IStackeable';

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
        if (this.spec.class !== undefined) col.classList.add(this.spec.class);
        col.classList.add('lto-col');

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => col.appendChild(x)));

        return col;
    }

}
Renderables.register("col", Col);
