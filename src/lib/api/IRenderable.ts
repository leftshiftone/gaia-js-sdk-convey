import {IRenderableSpec, IRenderer} from './IRenderer';

/**
 * Classes which implements this interface can be rendered by an IRenderer instance.
 */
export interface IRenderable {
    render(renderer: IRenderer, container: HTMLElement, send: (e: IRenderableSpec) => void): void;
}
