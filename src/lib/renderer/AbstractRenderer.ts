import Renderables from '../renderable/Renderables';
import {IRenderer, ISpecification, IRenderable, IStackeable} from '../api';

/**
 * Abstract renderer class.
 */
export abstract class AbstractRenderer implements IRenderer {

    protected readonly content: HTMLElement;
    protected readonly suggest: HTMLElement;

    constructor(content: HTMLElement, suggest: HTMLElement) {
        this.content = content;
        this.suggest = suggest;
    }

    /**
     * {@inheritDoc}
     */
    public render(message: ISpecification | IRenderable, containerType?: IStackeable): HTMLElement[] {
        if (message["render"] !== undefined) {
            return this.renderElement(message as IRenderable, containerType);
        }
        const renderable = this.getRenderable(message as ISpecification);
        return this.renderElement(renderable, containerType);
    }

    protected abstract renderElement(element: IRenderable, containerType?: IStackeable): HTMLElement[];

    // noinspection JSMethodCanBeStatic
    /**
     * Returns the element by evaluating the message type.
     *
     * @param message the message
     */
    private getRenderable(message: ISpecification): IRenderable {
        console.debug('Element message of type ' + message.type);
        const renderableClass = Renderables.resolve(message.type.toUpperCase());
        if (renderableClass === undefined) {
            console.error(`unable to render element of type "${message.type}"`);
        }
        return new renderableClass(message) as IRenderable;
    }

    public appendContent = (element: HTMLElement) => {
        this.content.appendChild(element);
    };

    public appendSuggest = (element: HTMLElement) => {
        this.suggest.appendChild(element);
    };

}
