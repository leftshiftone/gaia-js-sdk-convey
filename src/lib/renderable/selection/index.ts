import {IRenderable, IRenderer, ISpecification, IStackeable} from '../../api';
import Renderables from '../Renderables';
import EventStream from "../../event/EventStream";

/**
 * Implementation of the 'selection' markup element.
 */
export class Selection implements IRenderable, IStackeable {

    private readonly selection: HTMLElement;
    private readonly spec: ISpecification;
    private readonly numOfBlocks: number;
    private values: Array<any> = [];
    private isPublished: boolean = false;
    private animationDuration = 300;

    constructor(message: ISpecification) {
        this.spec = message;
        this.numOfBlocks = this.spec.elements!.length;
        this.selection = document.createElement('div');
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';

        this.selection.setAttribute("name", this.spec.name || "");
        this.selection.classList.add('lto-selection', "lto-" + position);

        if (this.spec.id !== undefined) {
            this.selection.id = this.spec.id;
        }
        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => this.selection.classList.add(e));

        let publishedBlocks: number = 0;
        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));

        elements.forEach(e => e.forEach(block => {
            const left = document.createElement("div");
            const right = document.createElement("div");
            block.style.userSelect = "none";
            block.classList.add("lto-selection-item");
            left.className = "lto-selection-left";
            right.className = "lto-selection-right";
            block.appendChild(left);
            block.appendChild(right);
            this.selection.appendChild(block);
        }));

        this.selection.querySelectorAll(".lto-block.lto-selection-item").forEach(block => {
            block.addEventListener("click", ev => {
                //@ts-ignore
                if (ev.target.getAttribute("class") === "lto-selection-left") {
                    block.classList.add("lto-animate-left");
                    this.values.push({[block.getAttribute("name") || ""]: "left"});
                } else {
                    block.classList.add("lto-animate-right");
                    this.values.push({[block.getAttribute("name") || ""]: "right"});
                }
                setTimeout(() => (block as HTMLElement).style.display = "none", this.animationDuration);

                if (++publishedBlocks === this.numOfBlocks) {
                    // wait till animation is finished
                    setTimeout(() => {
                        this.setFinished();
                        this.publish();
                    }, this.animationDuration);
                }
            })
        });

        if (isNested) {
            this.selection.classList.add('lto-nested');
        }

        if (this.spec.countdownInSec !== 0) {
            setTimeout(() => {
                this.setFinished();
                this.publish()
            }, this.spec.countdownInSec as number * 1000);
        }

        return this.selection;
    }

    public publish(): void {
        if (!this.isPublished) {
            this.selection.style.pointerEvents = "none";
            EventStream.emit("GAIA::publish", {
                attributes: {type: 'submit', value: JSON.stringify({[this.spec.name as string || ""]: this.values})},
                type: 'submit',
            });
            this.isPublished = true;
        }
    }

    private setFinished() {
        this.selection.classList.add("lto-selection-finished");
    }
}

Renderables.register("selection", Selection);
