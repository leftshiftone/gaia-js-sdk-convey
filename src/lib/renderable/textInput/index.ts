import {IRenderable, IRenderer, ISpecification} from '../../api';
import Renderables from '../Renderables';
import {InputContainer} from "../../support/InputContainer";

/**
 * Implementation of the 'textInput' markup element.
 * An input HTML element of type text is created and
 * the given attributes name, placeholder and value from
 * the markup are applied. The class lto-textInput is
 * added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 */
export class TextInput implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || "left";
        const textInput = document.createElement("input");
        textInput.setAttribute("type", "text");
        textInput.setAttribute("name", this.spec.name || "");
        textInput.setAttribute("placeholder", this.spec.placeholder || "");
        textInput.setAttribute("value", this.spec.value || "");
        InputContainer.setRequiredAttribute(textInput, this.spec.required);
        textInput.classList.add("lto-textInput", "lto-" + position);
        if (isNested) {
            textInput.classList.add("lto-nested")
        }

        if (this.spec.id !== undefined) {
            textInput.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => textInput.classList.add(e));
        }

        if (this.spec.regex !== undefined) textInput.pattern = this.spec.regex;

        textInput.addEventListener("change", () => textInput.setAttribute("value", textInput.value));
        return textInput;
    }
}

Renderables.register("textInput", TextInput);
