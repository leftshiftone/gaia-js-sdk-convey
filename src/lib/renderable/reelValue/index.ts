import {IRenderable, IRenderer, ISpecification, IStackeable} from '../../api';
import Renderables from '../Renderables';

/**
 * Implementation of the 'reelValue' markup element.
 * A HTML div element where a digit, char or image can be displayed.
 * For CSS manipulations the following classes are added:
 *  lto-reel-value: the container
 *  lto-reel-digit: is added when a digit is showed
 *  lto-image: is added when a image is showed
 *  lto-reel-char: is added when a char is showed
 *
 * @see {@link IRenderable}
 */
export class ReelValue implements IRenderable, IStackeable {

    private readonly spec: ISpecification;
    private readonly reelValue: HTMLDivElement;

    constructor(message: ISpecification) {
        this.spec = message;
        this.reelValue = document.createElement('div');
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        this.reelValue.classList.add('lto-reel-value', "lto-" + position);
        if (this.spec.id !== undefined) {
            this.reelValue.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => this.reelValue.classList.add(e));
        }

        switch (this.spec.valueType) {
            case 'img':
                this.appendImage();
                break;
            case 'digit':
                this.appendDigit();
                break;
            case 'char':
                this.appendChar();
                break;
            default:
                this.reelValue.appendChild(document.createTextNode(this.spec.value || ""))
        }

        this.reelValue.setAttribute("data-value", this.spec.value || "");

        if (isNested) {
            this.reelValue.classList.add('lto-nested')
        }

        return this.reelValue;
    }

    private appendImage() {
        const img = document.createElement("img");
        img.classList.add("lto-image", "lto-left", "lto-nested");
        img.src = this.spec.value || "";
        this.reelValue.appendChild(img);
    }

    private appendDigit() {
        this.reelValue.appendChild(document.createTextNode(this.spec.value || ""));
        this.reelValue.classList.add("lto-reel-digit");
    }

    private appendChar() {
        this.reelValue.appendChild(document.createTextNode(this.spec.value || ""));
        this.reelValue.classList.add("lto-reel-char");
    }

}

Renderables.register("reelValue", ReelValue);
