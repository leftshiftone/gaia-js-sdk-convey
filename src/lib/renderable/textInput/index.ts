import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'textInput' markup element.
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
        const position = this.spec.position || 'left';
        const textInput = document.createElement('input');
        textInput.setAttribute("type", "text");
        textInput.setAttribute('name', this.spec.name || "");
        textInput.setAttribute('required', this.spec.required !== undefined ? this.spec.required.toString() : "true");
        textInput.setAttribute('placeholder', this.spec.placeholder || "");
        if(this.spec.regex !== undefined) {
            textInput.setAttribute('pattern', this.spec.regex);
        }

        textInput.addEventListener("change", () => {
            if(textInput.checkValidity()) {
                textInput.setAttribute('value', textInput.value);
            }
        });

        textInput.classList.add("lto-textInput", "lto-" + position);
        if (isNested) {textInput.classList.add("lto-nested")}

        if(this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => textInput.classList.add(e));
        }

        return textInput;
    }
}

Renderables.register("textInput", TextInput);
