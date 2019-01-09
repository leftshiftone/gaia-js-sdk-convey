import {AbstractRenderable} from '../renderable/AbstractRenderable';
import {ClassicRenderer} from './ClassicRenderer';

/**
 * The content centric renderer tries to maximize the time a content is visible by updating
 * the content if possible or displaying interrupting actions like intent cascading by overlaying the content.
 */
export class ContentCentricRenderer extends ClassicRenderer {

    constructor(container: HTMLElement) {
        super(container);
    }

    protected renderElement(renderable: AbstractRenderable, append: boolean):HTMLElement {
        return super.renderElement(renderable, append);
    }

}
