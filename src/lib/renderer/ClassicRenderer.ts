import {AbstractRenderer} from './AbstractRenderer';
import {IRenderable} from '../api/IRenderable';
import {Button} from '../renderable/button';
import {Link} from '../renderable/link';
import {Defaults} from '../support/Defaults';
import {Suggestion} from '../renderable/suggestion';
import {IStackeable} from '../api/IStackeable';
import EventStream from '../event/EventStream';

/**
 * The classic renderer renders the G.A.I.A. messages in a classic top-down manner.
 */
export class ClassicRenderer extends AbstractRenderer {

    constructor(content?: HTMLElement, suggest?: HTMLElement) {
        super(content || Defaults.content(), suggest || Defaults.suggest());
        EventStream.addListener("GAIA::carousel", this.handleCarousel.bind(this));
    }

    protected renderElement(renderable: IRenderable, containerType?: IStackeable): HTMLElement[] {
        const array = [];
        const element = renderable.render(this, containerType !== undefined);

        array.push(element);

        if (containerType === undefined) {
            if (this.needsSeparator(renderable)) {
                const div = document.createElement('div');
                div.classList.add('lto-separator');
                array.push(div);
            }
        }

        setTimeout(() => {
            if (this.content != null) {
                this.content.scrollTop = this.content.scrollHeight;
            }
        }, 1);


        return array;
    }

    // noinspection JSMethodCanBeStatic
    private needsSeparator(renderable: IRenderable) {
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

    private handleCarousel(args:any[]) {
        const suggestions = this.suggest.querySelectorAll(".lto-suggestion");
        suggestions.forEach(suggestion => {
            suggestion.classList.remove("lto-hide");
            const value = suggestion.getAttribute("data-counter");
            if (value && (args[0] !== parseInt(value, 10))) {
                suggestion.classList.add("lto-hide");
            }
        });
    }

}
