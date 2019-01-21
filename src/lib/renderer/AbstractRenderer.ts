import {renderables} from '../renderable/Renderables';
import {IRenderer, ISpecification} from '../api/IRenderer';
import {IRenderable} from '../api/IRenderable';

/**
 * Abstract renderer class.
 */
export abstract class AbstractRenderer implements IRenderer {

    private static CONTAINER_ELEMENTS = ["block", "carousel", "col", "items", "row", "table", "block", "reel", "slotmachine"];

    protected static isNested(containerType?: string) {
        return containerType === undefined ? false : AbstractRenderer.CONTAINER_ELEMENTS.indexOf(containerType) >= 0;
    }

    private readonly target:HTMLElement;

    constructor(target:HTMLElement) {
        this.target = target;
    }

    /**
     * {@inheritDoc}
     */
    public render(message: ISpecification | IRenderable, containerType?:string): HTMLElement[] {
        if (message["render"] !== undefined) {
            return this.renderElement(message as IRenderable, containerType);
        }
        const renderable = this.getRenderable(message as ISpecification);
        return this.renderElement(renderable, containerType);
    }

    protected abstract renderElement(element: IRenderable, containerType?:string): HTMLElement[];

    // noinspection JSMethodCanBeStatic
    /**
     * Returns the element by evaluating the message type.
     *
     * @param message the message
     */
    private getRenderable(message: ISpecification): IRenderable {
        console.debug('Element message of type ' + message.type);
        const renderableClass = renderables[message.type.toUpperCase()];
        return new renderableClass(message) as IRenderable;
    }

    public append = (element: HTMLElement) => this.target.appendChild(element);

}
