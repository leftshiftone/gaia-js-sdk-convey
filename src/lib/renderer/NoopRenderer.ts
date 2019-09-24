import {IRenderer, ISpecification, IStackeable, IRenderable} from "../api";

/**
 * No-operation dummy renderer. Used for audio only.
 */
export class NoopRenderer implements IRenderer{

    /**
     * @inheritDoc
     */
    appendContent(element: HTMLElement): void {
        //noop
    }

    /**
     * @inheritDoc
     */
    appendSuggest(element: HTMLElement): void {
        //noop
    }

    /**
     * @inheritDoc
     */
    render(message: ISpecification | IRenderable, containerType?: IStackeable): HTMLElement[] {
        return [];
    }

}
