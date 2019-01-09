import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer, ISpecification} from '../../api/IRenderer';

/**
 * Implementation of the 'table' markup element.
 */
export class Table extends AbstractRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        super('table');
        this.spec = message;
    }

    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const table = document.createElement('table');
        if (!isNested) {
            const position = this.spec.position || 'left';
            table.classList.add('table', position);
            table.appendChild(Timestamp.render());

            const elements = renderer.render(this.spec, false);
            elements.forEach(table.appendChild);

            table.appendChild(new Icon(position).render());
        } else {
            table.classList.add('table-nested');
            const elements = renderer.render(this.spec, false);
            elements.forEach(table.appendChild);
        }

        return table;
    }
}
