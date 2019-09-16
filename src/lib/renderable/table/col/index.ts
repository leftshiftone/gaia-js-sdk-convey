import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../../api';
import Renderables from '../../Renderables';

/**
 * Implementation of the 'td' markup element.
 * A td HTML element is created and the class
 * lto-col is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link IStackeable}
 * @see {@link Table}
 * @see {@link Row}
 */
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
