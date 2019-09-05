import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

/**
 * Implementation of the 'textarea' markup element.
 * The textarea element is used for a simple textarea
 */
export class Textarea implements IRenderable {

    private readonly spec: ISpecification;

    /**
     * Constructor
     * @param spec evaluated specifications are:
     *      name: the name of the textarea
     *      placeholder: the placeholder of the textarea
     *      value: the default value which is set
     *      cols: number of columns
     *      rows: number of rows
     *      required: the textarea needs to be filled
     */
    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     * The render method receives the textarea markup and creates an HTML element.
     *
     * Class which is set per default: <b>lto-textarea</b>
     *
     * @param renderer can render furthermore nested elements if they exist
     * @param isNested if the HTML element is nested
     *
     * @returns {@link HTMLTextAreaElement} DOM representation of the textarea markup
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || "left";
        const textarea = node("textarea");

        textarea.addAttributes({
            cols: this.spec.cols,
            rows: this.spec.rows,
            id: this.spec.id ? this.spec.id : "",
            name: this.spec.name ? this.spec.name : "",
            placeholder: this.spec.placeholder ? this.spec.placeholder : "",
            class: this.spec.class ? this.spec.class : "",
        });

        textarea.addDataAttributes({required: this.spec.required || "false"});

        if (this.spec.value) {
            (textarea.unwrap() as HTMLTextAreaElement).value = this.spec.value;
            textarea.addAttributes({value: this.spec.value})
        }

        textarea.addClasses("lto-textarea", "lto-" + position, isNested ? "lto-nested" : "");

        textarea.unwrap().addEventListener("input", () => {
                if ((textarea.unwrap() as HTMLTextAreaElement).value === "") {
                    textarea.unwrap().removeAttribute("value");
                } else {
                    textarea.addAttributes({value: (textarea.unwrap() as HTMLTextAreaElement).value})
                }
            }
        );

        return textarea.unwrap();
    }
}

Renderables.register("textarea", Textarea);
