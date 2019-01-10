import {AbstractRenderer} from './AbstractRenderer';
import {IRenderable} from '../api/IRenderable';
import {Button} from '../renderable/button';
import {Link} from '../renderable/link';

/**
 * The classic renderer renders the G.A.I.A. messages in a classic top-down manner.
 */
export class ClassicRenderer extends AbstractRenderer {

    constructor(container: HTMLElement) {
        super(container);
    }

    protected renderElement(renderable: IRenderable, containerType?: string): HTMLElement[] {
        const array = [];
        const element = renderable.render(this, ClassicRenderer.isNested(containerType));

        array.push(element);

        if (!ClassicRenderer.isNested(containerType)) {
            if (this.needsSeparator(renderable)) {
                const div = document.createElement('div');
                div.classList.add('separator');
                array.push(div);
            }
        }

        const objDiv = document.querySelector('.gaia-chat .scrollbar');
        if (objDiv != null) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }

        return array;
    }

    // noinspection JSMethodCanBeStatic
    private needsSeparator(renderable:IRenderable) {
        if (renderable instanceof Button) {
            return false;
        }
        if (renderable instanceof Link) {
            return false;
        }
        return true;
    }

}
