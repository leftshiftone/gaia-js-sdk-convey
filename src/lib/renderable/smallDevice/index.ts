import {IRenderable, IRenderer, ISpecification, IStackeable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'block' markup element. A div HTML element
 * is created and the and the classes lto-block is added to
 * allow CSS modifications.
 *
 * @see {@link IRenderable}
 * @see {@link IStackeable}
 */
export class SmallDevice implements IRenderable, IStackeable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const smallDevice = document.createElement('div');
        smallDevice.classList.add('lto-small-device', "lto-" + position);
        smallDevice.setAttribute("name", this.spec.name || "");

        if (this.spec.id !== undefined) {
            smallDevice.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => smallDevice.classList.add(e));
        }

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => smallDevice.appendChild(x)));
        return smallDevice;
    }
}

Renderables.register("smallDevice", SmallDevice);
