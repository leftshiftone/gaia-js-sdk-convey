import {IRenderable, IRenderer, ISpecification, IStackeable} from '../../api';
import Renderables from '../Renderables';
import EventStream from '../../event/EventStream';

/**
 * Implementation of the 'carousel' markup element.
 * A HTML div element which can contain several 'form' or 'block' elements.
 * The user can switch between cells by clicking the next or previous button.
 * For CSS manipulations the following classes are added:
 *  lto-carousel: the container
 *  lto-carousel-cell: the container where a single markup element is wrapped
 *  lto-next: selects the next carousel cell
 *  lto-previous: selects the previous carousel cell
 *
 * @see {@link IRenderable}
 * @see {@link IStackeable}
 */
export class Carousel implements IRenderable, IStackeable {

    public spec: ISpecification;
    private readonly cellContainer: HTMLDivElement;
    private readonly carousel: HTMLDivElement;

    constructor(message: ISpecification) {
        this.spec = message;
        this.cellContainer = document.createElement("div");
        this.carousel = document.createElement("div");
    }

    /**
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        this.carousel.classList.add('lto-carousel', 'lto-left');
        if (this.spec.id !== undefined) {
            this.carousel.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => this.carousel.classList.add(e));
        }

        (this.spec.elements || []).map((e) => {
            renderer.render(e, this).forEach(x => {
                x.classList.add("lto-carousel-cell");
                this.cellContainer.appendChild(x);
            });
        });

        const next = document.createElement("div");
        const previous = document.createElement("div");

        next.addEventListener("click", () => this.next(this.getCurrent()));
        previous.addEventListener("click", () => this.previous(this.getCurrent()));

        next.classList.add("lto-next");
        previous.classList.add("lto-previous");

        const nextSpan = document.createElement("span");
        nextSpan.appendChild(document.createTextNode(">"));
        next.appendChild(nextSpan);

        const previousSpan = document.createElement("span");
        previousSpan.appendChild(document.createTextNode("<"));
        previous.appendChild(previousSpan);

        this.resetCells();
        this.init(this.getCurrent());

        for (let i = 0; i < this.cellContainer.children.length; i++) {
            const block = this.cellContainer.children[i];
            const attribute = document.createAttribute("data-counter");
            attribute.value = i + "";
            block.attributes.setNamedItem(attribute);

            const suggestions = block.querySelectorAll(".lto-suggestion");
            suggestions.forEach(suggestion => {
                block.removeChild(suggestion);
                suggestion.classList.remove("lto-nested");
                suggestion.attributes.setNamedItem(attribute.cloneNode(true) as Attr);
                if (i > 0) {
                    suggestion.classList.add("lto-hide");
                }
                renderer.appendSuggest(suggestion as HTMLElement);
            });
        }

        this.carousel.appendChild(this.cellContainer);

        this.carousel.appendChild(next);
        this.carousel.appendChild(previous);

        return this.carousel;
    }

    private init(current: number) {
        this.resetCells();
        EventStream.emit("GAIA::carousel", current);
        this.cellContainer.children[current].classList.remove("lto-not-visible-item");
        this.cellContainer.children[current].classList.add("lto-not-visible-item");

        const nextIndex = current + (this.cellContainer.children.length > 1 ? 1 : 0);

        this.cellContainer.children[nextIndex].classList.remove("lto-not-visible-item");
        this.cellContainer.children[nextIndex].classList.add("lto-next-item");

        setTimeout(() => this.carousel.style.height = (this.cellContainer.children[nextIndex] as HTMLElement).scrollHeight + "px", 1);
    }

    private next(current: number) {
        EventStream.emit("GAIA::carousel", current);
        this.resetCells();
        current + 1 === this.cellContainer.children.length ? current = 0 : current++;
        EventStream.emit("GAIA::carousel", current);
        if (current > 0) {
            this.cellContainer.children[current - 1].classList.remove("lto-not-visible-item");
            this.cellContainer.children[current - 1].classList.add("lto-previous-item");
        }
        this.cellContainer.children[current].classList.remove("lto-not-visible-item");
        this.cellContainer.children[current].classList.add("lto-center-item");
        if (current + 1 < this.cellContainer.children.length) {
            this.cellContainer.children[current + 1].classList.remove("lto-not-visible-item");
            this.cellContainer.children[current + 1].classList.add("lto-next-item");
        }
        setTimeout(() => this.carousel.style.height = (this.cellContainer.children[current] as HTMLElement).scrollHeight + "px", 1);
    }

    private previous(current: number) {
        this.resetCells();
        current === 0 ? current = this.cellContainer.children.length - 1 : current--;
        EventStream.emit("GAIA::carousel", current);
        if (current - 1 > -1) {
            this.cellContainer.children[current - 1].classList.remove("lto-not-visible-item");
            this.cellContainer.children[current - 1].classList.add("lto-previous-item");
        }
        this.cellContainer.children[current].classList.remove("lto-not-visible-item");
        this.cellContainer.children[current].classList.add("lto-center-item");
        if (current + 1 < this.cellContainer.children.length) {
            this.cellContainer.children[current + 1].classList.remove("lto-not-visible-item");
            this.cellContainer.children[current + 1].classList.add("lto-next-item");
        }
        setTimeout(() => this.carousel.style.height = (this.cellContainer.children[current] as HTMLElement).scrollHeight + "px", 1);
    }

    private getCurrent() {
        let current = 0;
        let counter = 0;

        this.cellContainer.childNodes.forEach(node => {
            if ((node as HTMLElement).classList.contains("lto-center-item")) {
                current = counter;
            }
            counter++;
        });

        return current;
    }

    private resetCells() {
        this.cellContainer.childNodes.forEach(node => {
            (node as HTMLElement).classList.remove("lto-center-item", "lto-next-item", "lto-previous-item", "lto-not-visible-item");
            (node as HTMLElement).classList.add("lto-not-visible-item");
        });
    }

}

Renderables.register("carousel", Carousel);
