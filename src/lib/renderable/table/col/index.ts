import {AbstractRenderable} from '../../AbstractRenderable';
import {IRenderer, ISpecification} from '../../../api/IRenderer';

export class Col extends AbstractRenderable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        super('col');
        this.spec = spec;
    }

    public render(renderer:IRenderer, isNested: boolean):HTMLElement {
        const col = document.createElement('td');
        col.classList.add('col');

        const elements = renderer.render(this.spec, false);
        elements.forEach(col.appendChild);

        return col;
    }
}
