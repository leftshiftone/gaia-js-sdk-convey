import {IRenderer, ISpecification} from "../api/IRenderer";
import {IRenderable} from "../api/IRenderable";
import {IStackeable} from "../api/IStackeable";

/**
 * No-operation dummy renderer. Used for audio only.
 * @author benjamin.krenn@leftshift.one
 * @since 0.12.0
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
