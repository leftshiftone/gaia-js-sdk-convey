import {ClassicRenderer} from './ClassicRenderer';
import {IRenderable} from '../api/IRenderable';

/**
 * The content centric renderer tries to maximize the time a content is visible by updating
 * the content if possible or displaying interrupting actions like intent cascading by overlaying the content.
 */
export class ContentCentricRenderer extends ClassicRenderer {

    constructor(container: HTMLElement) {
        super(container);
    }

    protected renderElement(renderable: IRenderable, containerType?:string):HTMLElement[] {
        return super.renderElement(renderable, containerType);
    }

}
