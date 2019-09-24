import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'slotMachine' markup element.
 * A HTML div element where multiple 'reel' elements can be displayed.
 * The class lto-slotmachine is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link IStackeable}
 */
export class SlotMachine implements IRenderable, IStackeable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const slotMachine = document.createElement("div");
        slotMachine.classList.add('lto-slotmachine', "lto-" + position);
        if (this.spec.id !== undefined) {
            slotMachine.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => slotMachine.classList.add(e));
        }
        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => slotMachine.appendChild(x)));

        if (isNested) {
            slotMachine.classList.add('lto-nested');
        }

        return slotMachine;
    }

}

Renderables.register("slotmachine", SlotMachine);
