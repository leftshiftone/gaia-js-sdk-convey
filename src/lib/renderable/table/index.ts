import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'table' markup element.
 * A table HTML element is created and the class
 * lto-table is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link IStackeable}
 * @see {@link Col}
 * @see {@link Row}
 */
export class Table implements IRenderable, IStackeable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * @inheritDoc
     */
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
