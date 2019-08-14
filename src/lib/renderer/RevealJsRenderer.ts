import {ContentCentricRenderer} from './ContentCentricRenderer';
import {IRenderable, IStackeable, ISpecification} from '../api';
import {Defaults} from '../support/Defaults';

/**
 * Renderer implementation which is based on the reveal.js library.
 * This renderer supports horizontal as well as vertical navigation.
 */
export class RevealJsRenderer extends ContentCentricRenderer {

    private readonly Reveal: any;

    constructor(options?: {}, content?: HTMLElement, suggest?: HTMLElement) {
        super(RevealJsRenderer.wrapContent(content), suggest);

        if (document === undefined) {
            return
        }

        this.Reveal = require("reveal.js/js/reveal.js");
        this.Reveal.initialize(options || {
            controls: false,
            progress: false,
            center: false,
            transitionSpeed: "slow"
        });
        this.scrollStrategy = () => {
        };
    }

    public render(message: ISpecification | IRenderable, containerType?: IStackeable): HTMLElement[] {
        if (message["render"] === undefined) {
            // do not render renderables with position 'right'
            // ***********************************************
            if ((message as ISpecification).position === "right") {
                return [];
            }
        }
        return super.render(message, containerType);
    }

    protected renderElement(renderable: IRenderable, containerType?: IStackeable): HTMLElement[] {
        //const elements = super.renderElement(renderable, containerType);

        // wrap renderables with class lto-container into a section element
        // ****************************************************************

        const section = document.createElement("section");
        const span = document.createElement("span");
        span.textContent = "test";
        section.append(span);

        return [section];

    }

    private static wrapContent(content?: HTMLElement): HTMLElement {
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");

        div1.classList.add("reveal");
        div2.classList.add("slides");

        (content || Defaults.content()).appendChild(div1);
        div1.appendChild(div2);

        return div2;
    }

    public appendContent = (element: HTMLElement) => {
        this.content.appendChild(element);
        if (this.Reveal) {
            console.debug("synch reveal");
            this.Reveal.sync();
        }
    };

}
