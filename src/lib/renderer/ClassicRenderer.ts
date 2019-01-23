import {AbstractRenderer} from './AbstractRenderer';
import {IRenderable} from '../api/IRenderable';
import {Button} from '../renderable/button';
import {Link} from '../renderable/link';
import {Defaults} from '../support/Defaults';
import {Suggestion} from '../renderable/suggestion';

/**
 * The classic renderer renders the G.A.I.A. messages in a classic top-down manner.
 */
export class ClassicRenderer extends AbstractRenderer {

    constructor(container?: HTMLElement) {
        super(container || Defaults.content());
    }

    protected renderElement(renderable: IRenderable, containerType?: string): HTMLElement[] {
        const array = [];
        const element = renderable.render(this, ClassicRenderer.isNested(containerType));

        array.push(element);

        if (!ClassicRenderer.isNested(containerType)) {
            if (this.needsSeparator(renderable)) {
                const div = document.createElement('div');
                div.classList.add('lto-separator');
                array.push(div);
            }
        }

        setTimeout(() => {
            const content = document.querySelector('.lto-content');
            if (content != null) {
                content.scrollTop = content.scrollHeight;
            }
        }, 1);


        return array;
    }

    // noinspection JSMethodCanBeStatic
    private needsSeparator(renderable:IRenderable) {
        if (renderable instanceof Button) {
            return false;
        }
        if (renderable instanceof Suggestion) {
            return false;
        }
        if (renderable instanceof Link) {
            return false;
        }
        return true;
    }

}
