import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'table' markup element.
 */
export class Table implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const table = document.createElement('table');
        const position = this.spec.position || 'left';

        if (this.spec.class !== undefined) table.classList.add(this.spec.class);
        table.classList.add('lto-table', "lto-" + position);

        if (!isNested) {
            table.appendChild(Timestamp.render());
            const elements = (this.spec.elements || []).map(e => renderer.render(e, "table"));
            elements.forEach(e => e.forEach(x => table.appendChild(x)));

            table.appendChild(new Icon(position).render());
        } else {
            table.classList.add("lto-nested");
            const elements = (this.spec.elements || []).map(e => renderer.render(e, "table"));
            elements.forEach(e => e.forEach(x => table.appendChild(x)));
        }

        return table;
    }

}
