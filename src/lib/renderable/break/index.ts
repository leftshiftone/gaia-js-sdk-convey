import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

/**
 * Implementation of the 'break' markup element.
 */
export class Break extends AbstractRenderable {

    constructor() {
        super('break');
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested: boolean):HTMLElement {
        return document.createElement('br');
    }

}
