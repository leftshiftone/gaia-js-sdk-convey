import {IRenderer, ISpecification} from '../../../api/IRenderer';
import {IRenderable} from '../../../api/IRenderable';

export class Col implements IRenderable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const col = document.createElement('td');
        col.classList.add('col');

        const elements = renderer.render(this.spec, false);
        elements.forEach(col.appendChild);

        return col;
    }

    public name = () => "col";

}
