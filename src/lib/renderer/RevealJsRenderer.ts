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
        const elements = super.renderElement(renderable, containerType);

        // wrap renderables with class lto-container into a section element
        // ****************************************************************
        console.debug(elements);
        console.debug(elements[0].outerHTML);

        if (elements[0].classList.contains("lto-container") &&
            !elements[0].outerHTML.includes("lto-transition")) {
            // create section
            console.debug("reached container section");
            const section = document.createElement("section");
            elements.forEach(e => section.appendChild(e));

            document.querySelectorAll("section.present").forEach(e => {
                e.classList.remove("present");
                e.classList.add("past");
            });
            section.classList.add("present");

            return [section];
        } else if (elements[0].classList.contains("lto-transition")) {

            console.debug(elements[0]);
            console.debug("reached transition check");
            const transition = elements[0];
            if (transition && transition.getAttribute("wrapped") === "in"
                && transition.getAttribute("direction") !== "down") {

                console.debug("reached transition section");
                // get last section
                const sections = document.getElementsByName("section");
                console.debug(sections);
                if (sections.length === 0) {
                    const section = document.createElement("section");
                    elements.forEach(e => section.appendChild(e));

                    document.querySelectorAll("section.present").forEach(e => {
                        e.classList.remove("present");
                        e.classList.add("past");
                    });
                    section.classList.add("present");

                    return [section];
                } else {
                    const lastSection = sections.item(sections.length-1);
                    elements.forEach(e => lastSection.appendChild(e));

                    document.querySelectorAll("section.present").forEach(e => {
                        e.classList.remove("present");
                        e.classList.add("past");
                    });
                    lastSection.classList.add("present");

                    return [lastSection];
                }
            }


        }

        return elements;

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
            this.Reveal.sync();
        }
    };

}
