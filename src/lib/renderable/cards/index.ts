import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';
import EventStream from "../../event/EventStream";

/**
 * Implementation of the 'cards' markup element.
 */
export class Cards implements IRenderable, IStackeable {

    private card: HTMLElement;
    private cardReject: HTMLElement;
    private cardLike: HTMLElement;
    private readonly cards: HTMLElement;
    private readonly spec: ISpecification;
    private animating: boolean = false;
    private deg: number = 0;
    private pullDeltaX: number = 0;
    private cardsCounter: number = 0;
    private readonly numOfCards: number;
    private decisionVal: number = 80;
    private isPublished: boolean = false;
    private value: Array<any> = [];

    constructor(message: ISpecification) {
        this.spec = message;
        this.numOfCards = this.spec.elements!.length;
        this.cards = document.createElement('div');
        this.cardLike = document.createElement('div');
        this.cardReject = document.createElement('div');
        this.card = document.createElement('div');
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';

        this.cards.setAttribute("name", this.spec.name || "");
        this.cards.classList.add('lto-cards', "lto-" + position);

        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => this.cards.classList.add(e));

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(e => {
            const card = document.createElement("div");
            card.classList.add("lto-card");
            card.appendChild(e);
            card.innerHTML += `<div class="lto-card-choice m-reject"></div><div class="lto-card-choice m-like"></div><div class="lto-card-drag"></div>`;
            this.cards.appendChild(card)
        }));

        this.cards.querySelectorAll(".lto-card:not(.inactive)").forEach(c => {
            (c as HTMLElement).onmousedown = e => {
                if (this.animating) return;
                this.card = c as HTMLElement;
                this.cardReject = c.querySelectorAll(".lto-card-choice.m-reject").item(0) as HTMLElement;
                this.cardLike = c.querySelectorAll(".lto-card-choice.m-like").item(0) as HTMLElement;
                const startX = e.pageX;

                document.onmousemove = (e) => {
                    const x = e.pageX;
                    this.pullDeltaX = (x - startX);
                    if (!this.pullDeltaX) return;
                    this.pullChange();
                };

                document.onmouseup = () => {
                    document.onmousemove = () => undefined;
                    document.onmouseup = () => undefined;
                    if (!this.pullDeltaX) return;
                    this.release()
                }
            };
            (c as HTMLElement).ontouchstart = e => {
                if (this.animating) return;
                this.card = c as HTMLElement;
                this.cardReject = c.querySelectorAll(".lto-card-choice.m-reject").item(0) as HTMLElement;
                this.cardLike = c.querySelectorAll(".lto-card-choice.m-like").item(0) as HTMLElement;
                const startX = e.touches[0].pageX;

                document.ontouchmove = (e) => {
                    const x = e.touches[0].pageX;
                    this.pullDeltaX = (x - startX);
                    if (!this.pullDeltaX) return;
                    this.pullChange();
                };

                document.ontouchend = () => {
                    document.ontouchend = () => undefined;
                    document.ontouchmove = () => undefined;
                    if (!this.pullDeltaX) return;
                    this.release()
                }
            }
        });

        if (isNested)
            this.cards.classList.add('lto-nested');

        if (this.spec.countdownInSec !== 0)
            setTimeout(() => this.publish(), this.spec.countdownInSec as number * 1000);

        return this.cards;
    }

    public pullChange() {
        this.animating = true;
        this.deg = this.pullDeltaX / 10;
        this.card.style.transform = "translateX(" + this.pullDeltaX + "px) rotate(" + this.deg + "deg)";

        const opacity = this.pullDeltaX / 100;
        const rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
        const likeOpacity = (opacity <= 0) ? 0 : opacity;

        this.cardReject.style.opacity = rejectOpacity.toString();
        this.cardLike.style.opacity = likeOpacity.toString();
    };

    private release() {
        const name = this.card.getElementsByClassName("lto-block").item(0).getAttribute("name") as string;
        if (this.pullDeltaX >= this.decisionVal) {
            this.value.push({[name]: true});
            this.card.classList.add("to-right");
        } else if (this.pullDeltaX <= this.decisionVal * -1) {
            this.value.push({[name]: false});
            this.card.classList.add("to-left");
        }

        if (Math.abs(this.pullDeltaX) >= this.decisionVal) {
            this.card.classList.add("inactive");

            setTimeout(() => {
                this.card.classList.add("below");
                this.card.classList.remove("inactive", "to-left", "to-right");
                this.cardsCounter++;
                if (this.cardsCounter === this.numOfCards)
                    this.publish()
            }, 300);
        }

        if (Math.abs(this.pullDeltaX) < this.decisionVal)
            this.card.classList.add("reset");

        setTimeout(() => {
            this.card.setAttribute("style", "");
            this.card.classList.remove("reset");
            this.card.querySelectorAll(".lto-card-choice").forEach(e => e.setAttribute("style", ""));
            this.pullDeltaX = 0;
            this.animating = false;
        }, 300);
    };


    public publish() {
        if (!this.isPublished) {
            this.cards.style.pointerEvents = "none";
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
}

Renderables.register("cards", Cards);
