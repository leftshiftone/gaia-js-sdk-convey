import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';
import EventStream from "../../event/EventStream";

/**
 * Implementation of the 'swipe' markup element.
 */
export class Swipe implements IRenderable, IStackeable {

    private card: HTMLElement;
    private choiceLeft: HTMLElement;
    private choiceRight: HTMLElement;
    private readonly swipe: HTMLElement;
    private readonly spec: ISpecification;
    private animating: boolean = false;
    private deg: number = 0;
    private pullDeltaX: number = 0;
    private cardsCounter: number = 0;
    private readonly numOfCards: number;
    private decisionVal: number = 80;
    private isPublished: boolean = false;
    private value: Array<any> = [];
    private startX: number = 0;

    constructor(message: ISpecification) {
        this.spec = message;
        this.numOfCards = this.spec.elements!.length;
        this.swipe = document.createElement('div');
        this.choiceRight = document.createElement('div');
        this.choiceLeft = document.createElement('div');
        this.card = document.createElement('div');
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';

        this.swipe.setAttribute("name", this.spec.name || "");
        this.swipe.classList.add('lto-swipe', "lto-" + position);

        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => this.swipe.classList.add(e));

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(block => {
            const card = document.createElement("div");
            const choiceRight = document.createElement('div');
            const choiceLeft = document.createElement('div');

            card.className = "lto-card";
            choiceRight.className = "lto-choice lto-choice-right";
            choiceLeft.className = "lto-choice lto-choice-left";
            block.style.userSelect = "none";

            card.appendChild(block);
            card.appendChild(choiceRight);
            card.appendChild(choiceLeft);
            this.swipe.appendChild(card)
        }));

        this.swipe.querySelectorAll(".lto-card:not(.lto-inactive)").forEach(card => {
            card.addEventListener("mousedown", (e:any) => {
                if (this.animating) return;
                this.card = card as HTMLElement;
                this.choiceLeft = card.querySelectorAll(".lto-choice.lto-choice-left").item(0) as HTMLElement;
                this.choiceRight = card.querySelectorAll(".lto-choice.lto-choice-right").item(0) as HTMLElement;
                this.startX = e.pageX;

                document.addEventListener("mousemove", this.mousemove);
                document.addEventListener("mouseup", this.end);
            });

            card.addEventListener("touchstart", e => {
                if (this.animating) return;
                this.card = card as HTMLElement;
                this.choiceLeft = card.querySelectorAll(".lto-choice.lto-choice-left").item(0) as HTMLElement;
                this.choiceRight = card.querySelectorAll(".lto-choice.lto-choice-right").item(0) as HTMLElement;
                this.startX = e.touches[0].pageX;

                document.addEventListener("touchmove", this.touchmove);
                document.addEventListener("touchend", this.end);
            });
        });

        if (isNested)
            this.swipe.classList.add('lto-nested');

        if (this.spec.countdownInSec !== 0)
            setTimeout(() => this.publish(), this.spec.countdownInSec as number * 1000);

        return this.swipe;
    }

    public pullChange(): void {
        this.animating = true;
        this.deg = this.pullDeltaX / 10;
        this.card.style.transform = "translateX(" + this.pullDeltaX + "px) rotate(" + this.deg + "deg)";

        const opacity = this.pullDeltaX / 100;
        const leftOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
        const rightOpacity = (opacity <= 0) ? 0 : opacity;

        this.choiceLeft.style.opacity = leftOpacity.toString();
        this.choiceRight.style.opacity = rightOpacity.toString();
    };

    private release(): void {
        const name = this.card.getElementsByClassName("lto-block").item(0).getAttribute("name") as string;
        if (this.pullDeltaX >= this.decisionVal) {
            this.value.push({[name]: true});
            this.card.classList.add("lto-to-right");
        } else if (this.pullDeltaX <= this.decisionVal * -1) {
            this.value.push({[name]: false});
            this.card.classList.add("lto-to-left");
        }

        if (Math.abs(this.pullDeltaX) >= this.decisionVal) {
            this.card.classList.add("lto-inactive");

            setTimeout(() => {
                this.card.classList.add("lto-below");
                this.card.classList.remove("lto-inactive", "lto-to-left", "lto-to-right");
                this.cardsCounter++;
                if (this.cardsCounter === this.numOfCards)
                    this.publish()
            }, 100);
        }

        if (Math.abs(this.pullDeltaX) < this.decisionVal)
            this.card.classList.add("lto-reset");

        setTimeout(() => {
            this.card.setAttribute("style", "");
            this.card.classList.remove("lto-reset");
            this.card.querySelectorAll(".lto-choice").forEach(e => e.setAttribute("style", ""));
            this.pullDeltaX = 0;
            this.animating = false;
        }, 100);
    };

    public publish(): void {
        if (!this.isPublished) {
            this.swipe.style.pointerEvents = "none";
            EventStream.emit("GAIA::publish", {
                timestamp: "",
                text: "",
                attributes: {type: 'submit', value: JSON.stringify({[this.spec.name as string || ""]: this.value})},
                type: 'submit',
                position: 'right'
            });
            this.isPublished = true;
        }
    }

    private mousemove = (e:MouseEvent) => {
        const x = e.pageX;
        this.pullDeltaX = (x - this.startX);
        if (!this.pullDeltaX) return;
        this.pullChange();
    };

    private touchmove = (e:TouchEvent) => {
        const x = e.touches[0].pageX;
        this.pullDeltaX = (x - this.startX);
        if (!this.pullDeltaX) return;
        this.pullChange();
    };

    private end = () => {
        document.removeEventListener("mousemove", this.mousemove);
        document.removeEventListener("touchmove", this.touchmove);
        document.removeEventListener("mouseup", this.end);
        document.removeEventListener("touchend", this.end);
        if (!this.pullDeltaX) return;
        this.release()
    };

}

Renderables.register("swipe", Swipe);
