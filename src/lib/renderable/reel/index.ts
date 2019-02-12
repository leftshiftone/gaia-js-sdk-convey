import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';

/**
 * Implementation of the 'reel' markup element.
 */
export class Reel implements IRenderable, IStackeable {

    private readonly spec: ISpecification;
    private counter: number;
    private readonly reel: HTMLDivElement;
    private readonly container: HTMLDivElement;

    constructor(message: ISpecification) {
        this.spec = message;
        this.counter = 0;
        this.reel = document.createElement('div');
        this.container = document.createElement('div');
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        this.reel.classList.add('lto-reel', "lto-" + position);
        if (this.spec.class !== undefined) this.reel.classList.add(this.spec.class);

        this.reel.setAttribute("name", this.spec.name || "");

        const up = document.createElement("div");
        const upSpan = document.createElement("span");
        upSpan.appendChild(document.createTextNode("up"));
        up.appendChild(upSpan);
        up.classList.add("lto-up");
        up.addEventListener("click", () => this.next());

        const down = document.createElement("div");
        const downSpan = document.createElement("span");
        downSpan.appendChild(document.createTextNode("down"));
        down.appendChild(downSpan);
        down.classList.add("lto-down");
        down.addEventListener("click", () => this.previous());

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => this.container.appendChild(x)));

        this.container.childNodes.forEach(child => {
            (child as HTMLElement).classList.add("lto-passive");
        });

        this.container.children[0].classList.replace("lto-passive", "lto-active");

        if (isNested) { this.reel.classList.add('lto-nested') }

        this.setValueToReel(this.container.children[this.counter].getAttribute("value"));

        this.reel.appendChild(up);
        this.reel.appendChild(this.container);
        this.reel.appendChild(down);

        return this.reel;
    }

    public next() {
        (this.counter + 1) < this.container.children.length ? this.counter++ : this.counter = 0;

        this.setValueToReel(this.container.children[this.counter].getAttribute("value"));

        this.container.childNodes.forEach(child => {
            (child as HTMLElement).classList.remove("lto-passive", "lto-active");
            (child as HTMLElement).classList.add("lto-passive");
        });
        this.container.children[this.counter].classList.replace("lto-passive", "lto-active");
    }

    public previous() {
        (this.counter - 1) >= 0 ? this.counter-- : this.counter = this.container.children.length - 1;

        this.setValueToReel(this.container.children[this.counter].getAttribute("value"));

        this.container.childNodes.forEach(child => {
            (child as HTMLElement).classList.remove("lto-passive", "lto-active");
            (child as HTMLElement).classList.add("lto-passive");
        });
        this.container.children[this.counter].classList.replace("lto-passive", "lto-active");
    }

    private setValueToReel(value: any) {
        this.reel.setAttribute("value", value);
    }
}
Renderables.register("reel", Reel);
