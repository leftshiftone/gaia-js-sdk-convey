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

    public name = () => "table";

}
