import {IRenderer} from './IRenderer';

/**
 * Classes which implements this interface can be rendered by an IRenderer instance.
 */
export interface IRenderable {
    render(renderer: IRenderer, isNested:boolean): HTMLElement;
}
