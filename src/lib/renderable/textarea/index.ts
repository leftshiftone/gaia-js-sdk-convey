import {IRenderable, IRenderer, ISpecification} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";
import {InputContainer} from "../../support/InputContainer";

/**
 * Implementation of the 'textarea' markup element.
 * A textarea HTML element is created and the given
 * attributes cols, rows, id, name, placeholder and class are applied.
 * The class lto-textarea is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
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
        });
        InputContainer.setRequiredAttribute(textarea.unwrap(), this.spec.required);

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
