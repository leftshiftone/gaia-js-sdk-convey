import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';

/**
 * Implementation of the 'table' markup element.
 */
export class Table implements IRenderable, IStackeable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const table = document.createElement('table');
        const position = this.spec.position || 'left';

        if (this.spec.id !== undefined) {
            table.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => table.classList.add(e));
        }
        table.classList.add('lto-table', "lto-" + position);

        if (!isNested) {
            table.appendChild(Timestamp.render());
            const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
            elements.forEach(e => e.forEach(x => table.appendChild(x)));

            table.appendChild(new Icon(position).render());
        } else {
            table.classList.add("lto-nested");
            const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
            elements.forEach(e => e.forEach(x => table.appendChild(x)));
        }

        return table;
    }

}

Renderables.register("table", Table);
