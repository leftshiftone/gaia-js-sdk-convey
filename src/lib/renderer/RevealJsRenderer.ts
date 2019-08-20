import {ContentCentricRenderer} from './ContentCentricRenderer';
import {IRenderable, IStackeable, ISpecification} from '../api';
import {Defaults} from '../support/Defaults';

/**
 * Renderer implementation which is based on the reveal.js library.
 * This renderer supports horizontal as well as vertical navigation.
 */
export class RevealJsRenderer extends ContentCentricRenderer {

    private Reveal: any;

    constructor(options?: {}, content?: HTMLElement, suggest?: HTMLElement) {
        super(RevealJsRenderer.wrapContent(content), suggest);

        if (document === undefined) {
            return
        }

        this.Reveal = require("reveal.js/js/reveal.js");
        this.Reveal.initialize(options || {
            controls: false,
            progress: false,
            center: true,
            hash: true,
            controlsLayout: 'bottom-right',
            autoSlide: 1,

            transition: 'slide',
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

        const sections = document.getElementsByTagName("section");

        // open issue controls
        //const controls = document.getElementsByClassName("controls");

        if (elements[0].classList.contains("lto-container") &&
            !elements[0].outerHTML.includes("lto-transition")) {
            // create section
            console.debug("reached container section");
            return this.createNewSection(elements, sections);
        } else if (elements[0].classList.contains("lto-container") &&
            elements[0].outerHTML.includes("lto-transition")) {

            console.debug(elements[0]);
            console.debug("reached transition check");
            const transition = elements[0].firstElementChild;

            if (transition && transition.getAttribute("wrapped") === "in") {

                console.debug("reached transition section");
                // get last section

                if (sections.length === 0) {
                    return this.createNewSection(elements, sections);
                } else {
                    const lastSection = sections.item(sections.length-1);
                    console.debug(lastSection);
                    if (lastSection) {
                        elements.forEach(e => lastSection.appendChild(e));
                        return [lastSection];
                    }
                }
            } else {
                return this.createNewSection(elements, sections);
            }
        }

        // what needs to be returned if I don't want to add to the dom?
        return elements;
    }

    private createNewSection (elements: HTMLElement[], sections: HTMLCollectionOf<HTMLElement>) : HTMLElement [] {
        const section = document.createElement("section");
        elements.forEach(e => section.appendChild(e));

        document.querySelectorAll("section.present").forEach(e => {
            e.classList.remove("present");
            e.classList.add("past");
        });
        section.classList.add("present");


        return [section];
    }

    private static wrapContent(content?: HTMLElement): HTMLElement {
        const revealDiv = document.createElement("div");
        const slidesDiv = document.createElement("div");

        revealDiv.classList.add('reveal', 'slide', 'center', 'has-horizontal-slides',
            'has-vertical-slides', 'ready');
        revealDiv.setAttribute("role", "application");
        revealDiv.setAttribute("data-transition-speed", "default");
        revealDiv.setAttribute("data-background-transition", "fade");
        slidesDiv.classList.add("slides");

        (content || Defaults.content()).appendChild(revealDiv);
        revealDiv.appendChild(slidesDiv);

        return slidesDiv;
    }

    public appendContent = (element: HTMLElement) => {
        this.content.appendChild(element);
        if (this.Reveal) {
            this.Reveal.sync();
        }
    };

}
