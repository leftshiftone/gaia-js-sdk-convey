import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'textInput' markup element.
 * The textInput element is used for a simple text input
 */
export class TextInput implements IRenderable {

    private readonly spec: ISpecification;

    /**
     * Constructor
     * @param spec evaluated specifications are:
     *      name: the name of the textInput
     *      placeholder: the placeholder of the textInput
     *      value: the default value which is set
     *      regex: the pattern which is set
     *      required: the textInput needs to be filled
     */
    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     * The render method receives the textInput markup and creates an HTML element.
     *
     * Class which is set per default: <b>lto-textInput</b>
     *
     * @param renderer can render furthermore nested elements if they exist
     * @param isNested if the HTML element is nested
     *
     * @returns {@link HTMLInputElement} DOM representation of the textInput markup
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || "left";
        const textInput = document.createElement("input");
        textInput.setAttribute("type", "text");
        textInput.setAttribute("name", this.spec.name || "");
        textInput.setAttribute("placeholder", this.spec.placeholder || "");
        textInput.setAttribute("value", this.spec.value || "");
        textInput.dataset.required = this.spec.required!.toString() || "false";
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
