import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'reel' markup element.
 */
export class Reel implements IRenderable {

    private readonly spec: ISpecification;
    private counter: number;
    private reel: HTMLDivElement;

    constructor(message: ISpecification) {
        this.spec = message;
        this.counter = 0;
        this.reel = document.createElement('div');
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean): HTMLElement {
        const position = this.spec.position || 'left';
        this.reel.classList.add('lto-reel', "lto-" + position);

        const up = document.createElement("input");
        up.setAttribute("type", "button");
        up.setAttribute("value", "up");
        up.classList.add("lto-button");
        up.addEventListener("click", () => this.next());

        const down = document.createElement("input");
        down.setAttribute("type", "button");
        down.setAttribute("value", "down");
        down.classList.add("lto-button");
        down.addEventListener("click", () => this.previous());

        this.reel.appendChild(up);
        const separator = document.createElement("div");
        separator.classList.add("lto-separator");
        this.reel.appendChild(separator);

        const elements = (this.spec.elements || []).map(e => renderer.render(e, "reel"));
        elements.forEach(e => e.forEach(x => this.reel.appendChild(x)));

        this.reel.appendChild(down);

        this.reel.querySelectorAll("img").forEach(child => {
            child.classList.add("lto-passive");
        });

        this.reel.querySelectorAll("img")[0].classList.replace("lto-passive", "lto-active");

        if (isNested) {
            this.reel.classList.add('lto-nested');
        }

        return this.reel;
    }

    public next() {
        if((this.counter + 1) < this.reel.querySelectorAll("img").length) {
            this.counter++;
            this.reel.setAttribute("value", this.counter+"")
        }

        const children = this.reel.querySelectorAll("img");
        children.forEach(child => {
            child.classList.remove("lto-passive", "lto-active");
            child.classList.add("lto-passive");
        });
        children[this.counter].classList.replace("lto-passive","lto-active");
    }

    public previous() {
        if((this.counter - 1) >= 0) {
            this.counter--;
            this.reel.setAttribute("value", this.counter+"")
        }

        const children = this.reel.querySelectorAll("img");
        children.forEach(child => {
            child.classList.remove("lto-passive", "lto-active");
            child.classList.add("lto-passive");
        });
        children[this.counter].classList.replace("lto-passive","lto-active");
    }

}
