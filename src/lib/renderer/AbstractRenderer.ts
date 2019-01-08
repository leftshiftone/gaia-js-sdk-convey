import {AbstractRenderable} from '../renderable/AbstractRenderable';
import {renderables} from '../renderable/Renderables';
import {IRenderableSpec, IRenderer} from '../api/IRenderer';

/**
 * Abstract renderer class.
 */
export abstract class AbstractRenderer implements IRenderer {

    /**
     * {@inheritDoc}
     */
    public render(message: any, sendMessage: any): void {
        const element = this.getElement(message);
        element.map(e => this.renderElement(e, sendMessage));
    }

    protected abstract renderElement(element: AbstractRenderable, sendMessage: any): void;

    /**
     * Returns the element by evaluating the message type.
     *
     * @param message the message
     */
    private getElement(message: IRenderableSpec): AbstractRenderable[] {
        if (message.type.toUpperCase() === 'CONTAINER') {
            const renderables = message.elements.map((element: IRenderableSpec) => {
                return this.getElement(element);
            });
            return [].concat.apply([], renderables);
        }
        console.debug('Element message of type ' + message.type);
        const componentClass = renderables[message.type.toUpperCase()];
        return [new componentClass(message) as AbstractRenderable];
    }

}

