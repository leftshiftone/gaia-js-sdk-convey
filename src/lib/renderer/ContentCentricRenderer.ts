import {ClassicRenderer} from './ClassicRenderer';
import {IRenderable} from '../api/IRenderable';
import {Suggestion} from '../renderable/suggestion';

/**
 * The content centric renderer tries to maximize the time a content is visible by updating
 * the content if possible or displaying interrupting actions like intent cascading by overlaying the content.
 */
export class ContentCentricRenderer extends ClassicRenderer {

    constructor(container: HTMLElement) {
        super(container);
    }

    protected renderElement(renderable: IRenderable, containerType?:string):HTMLElement[] {
        if (renderable instanceof Suggestion) {
            const containers = document.getElementsByClassName("lto-container");
            const containerZ = containers[containers.length];

            console.log(containerZ);
        }

        return super.renderElement(renderable, containerType);
    }

}
