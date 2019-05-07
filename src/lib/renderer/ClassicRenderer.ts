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
                if (this.scrollStrategy === "bottom") {
                    this.bottomScrollStrategy(this.content);
                }
                else if (this.scrollStrategy === "container") {
                    this.containerScrollStrategy(this.content);
                }
                else {
                    this.scrollStrategy(this.content)
                }
            }
        }, 1);

        return array;
    }

    // noinspection JSMethodCanBeStatic
    private needsSeparator(renderable: IRenderable): boolean {
        switch (renderable.constructor) {
            case Button:
                return false;
            case Suggestion:
                return false;
            case Link:
                return false;
            default:
                return true;
        }
    }

    private handleCarousel(args: any[]) {
        const suggestions = this.suggest.querySelectorAll(".lto-suggestion");
        suggestions.forEach(suggestion => {
            suggestion.classList.remove("lto-hide");
            const value = suggestion.getAttribute("data-counter");
            if (value && (args[0] !== parseInt(value, 10))) {
                suggestion.classList.add("lto-hide");
            }
        });
    }

    /**
     * The bottom scroll strategy autoscrolls to the bottom of the content element.
     *
     * @param e
     */
    private bottomScrollStrategy = (e:HTMLElement) => e.scrollTop = e.scrollHeight;

    /**
     * The container scroll strategy autoscrolls to the last renderable with a .lto-container class.
     *
     * @param e
     */
    private containerScrollStrategy = (e:HTMLElement) => {
        let list = e.querySelectorAll(".lto-container");
        let item = list.item(list.length - 1) as HTMLElement;

        item.scrollIntoView()
    };

    /**
     * The scroll strategy is used to define the manner of scroll automation
     * after the rendering of a renderable.
     */
    protected scrollStrategy: "bottom" | "container" | ((e:HTMLElement) => void) = this.bottomScrollStrategy;

}
