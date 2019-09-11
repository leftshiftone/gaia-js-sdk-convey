import {IRenderable, IRenderer, ISpecification} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

/**
 * Implementation of the 'textarea' markup element.
 */
export class Textarea implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
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
            required: this.spec.required
        });

        if (this.spec.value) {
            (textarea.unwrap() as HTMLTextAreaElement).value = this.spec.value;
            textarea.addAttributes({value: this.spec.value})
        }

        textarea.addClasses("lto-textarea", "lto-" + position, isNested ? "lto-nested" : "");

        textarea.unwrap().addEventListener("input", () => {
                if ((textarea.unwrap() as HTMLTextAreaElement).value === "") {
                    textarea.unwrap().removeAttribute("data-value");
                } else {
                    textarea.unwrap().setAttribute("data-value", (textarea.unwrap() as HTMLTextAreaElement).value)
                }
            }
        );

        return textarea.unwrap();
    }
}

Renderables.register("textarea", Textarea);
