import {IRenderer} from './IRenderer';

/**
 * Classes which implements this interface can be rendered by an {@link IRenderer} instance.
 */
export interface IRenderable {

    /**
     * Renders an element
     *
     * @return the element which was rendered
     * @param renderer the {@link IRenderer} which can be used for wrapping elements in the current element
     * @param isNested the boolean containing if the element is already wrapped in another element
     */
    render(renderer: IRenderer, isNested:boolean): HTMLElement;
}
