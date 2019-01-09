import {AbstractRenderable} from '../renderable/AbstractRenderable';
import {renderables} from '../renderable/Renderables';
import {IRenderer, ISpecification} from '../api/IRenderer';
import {IRenderable} from '../api/IRenderable';

/**
 * Abstract renderer class.
 */
export abstract class AbstractRenderer implements IRenderer {

    private static NESTED_ELEMENTS = ["block", "carousel", "col"];

    protected static isNested(container: HTMLElement) {
        return AbstractRenderer.NESTED_ELEMENTS.find(e => container.classList.contains(e)) !== undefined;
    }

    /**
     * {@inheritDoc}
     */
    public render(message: ISpecification | IRenderable, append: boolean): HTMLElement[] {
        if (message instanceof AbstractRenderable) {
            return [this.renderElement(message as AbstractRenderable, append)];
        }
        const renderables = this.getRenderables(message as ISpecification);
        return renderables.map(r => this.renderElement(r, append));
    }

    protected abstract renderElement(element: AbstractRenderable, append:boolean): HTMLElement;

    /**
     * Returns the element by evaluating the message type.
     *
     * @param message the message
     */
    private getRenderables(message: ISpecification): AbstractRenderable[] {
        if (message.type.toUpperCase() === 'CONTAINER') {
            const renderables = message.elements.map((element: ISpecification) => {
                return this.getRenderables(element);
            });
            return [].concat.apply([], renderables);
        }
        console.debug('Element message of type ' + message.type);
        const renderableClass = renderables[message.type.toUpperCase()];
        return [new renderableClass(message) as AbstractRenderable];
    }

}

