import {IRenderable} from './IRenderable';
import {IStackeable} from './IStackeable';
import { ISpecification } from './ISpecification';

/**
 * Classes which implement this interface can render incoming elements
 */
export interface IRenderer {

    /**
     * Renders an element
     *
     * @param message the message which was received
     * @param containerType
     */
    render(message: ISpecification | IRenderable, containerType?: IStackeable): HTMLElement[];

    /**
     * Appends the incoming {@link HTMLElement} to the content div which is specified in the used renderer
     *
     * @param element the element which will be appended
     */
    appendContent(element: HTMLElement): void;

    /**
     * Appends the incoming {@link HTMLElement} to the suggestion div which is specified in the used renderer
     *
     * @param element the element which will be appended
     */
    appendSuggest(element: HTMLElement): void;
}

