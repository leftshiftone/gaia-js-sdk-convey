import {IRenderer} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'break' markup element.
 */
export class Break implements IRenderable {

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        return document.createElement('br');
    }

    public name = () => "break";

}
