import {IRenderer, ISpecification, IStackeable, IRenderable} from "../api";

/**
 * No-operation dummy renderer. Used for audio only.
 */
export class NoopRenderer implements IRenderer{
    appendContent(element: HTMLElement): void {
        //noop
    }

    appendSuggest(element: HTMLElement): void {
        //noop
    }

    render(message: ISpecification | IRenderable, containerType?: IStackeable): HTMLElement[] {
        return [];
    }

}
