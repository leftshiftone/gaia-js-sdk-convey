import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';

/**
 * Implementation of the 'reelValue' markup element.
 */
export class ReelValue implements IRenderable, IStackeable {

    private readonly spec: ISpecification;
    private reelValue: HTMLDivElement;

    constructor(message: ISpecification) {
        this.spec = message;
        this.reelValue = document.createElement('div');
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        this.reelValue.classList.add('lto-reel-value', "lto-" + position);
        if (this.spec.class !== undefined) this.reelValue.classList.add(this.spec.class);

        this.reelValue.setAttribute("value", this.spec.value || "");
        this.reelValue.setAttribute("name", "name");

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => this.reelValue.appendChild(x)));

        switch(this.spec.valuetype) {
            case 'img': this.appendImage(); break;
            case 'digit': this.appendDigit(); break;
            case 'char': this.appendChar(); break;
            default: this.reelValue.appendChild(document.createTextNode(this.spec.value || ""))
        }


        if (isNested) { this.reelValue.classList.add('lto-nested') }

        return this.reelValue;
    }

    private appendImage() {
        const img = document.createElement("img");
        img.classList.add("lto-image", "lto-left", "lto-nested");
        img.src = this.spec.value || "";
        this.reelValue.appendChild(img);
        this.reelValue.setAttribute("value", this.spec.value || "");
    }

    private appendDigit() {
        this.reelValue.appendChild(document.createTextNode(this.spec.value || ""));
        this.reelValue.classList.add("lto-reel-digit");
        this.reelValue.setAttribute("value", this.spec.value || "");
    }

    private appendChar() {
        this.reelValue.appendChild(document.createTextNode(this.spec.value || ""));
        this.reelValue.classList.add("lto-reel-char");
        this.reelValue.setAttribute("value", this.spec.value || "");
    }

}
Renderables.register("reelValue", ReelValue);
