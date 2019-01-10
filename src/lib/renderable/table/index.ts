import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'table' markup element.
 */
export class Table implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const table = document.createElement('table');
        if (!isNested) {
            const position = this.spec.position || 'left';
            table.classList.add('lto-table', "lto-" + position);
            table.appendChild(Timestamp.render());

            const elements = (this.spec.elements || []).map(e => renderer.render(e, "table"));
            elements.forEach(e => e.forEach(x => table.appendChild(x)));

            table.appendChild(new Icon(position).render());
        } else {
            table.classList.add('lto-table", "lto-nested');
            const elements = (this.spec.elements || []).map(e => renderer.render(e, "table"));
            elements.forEach(e => e.forEach(x => table.appendChild(x)));
        }

        return table;
    }

}
