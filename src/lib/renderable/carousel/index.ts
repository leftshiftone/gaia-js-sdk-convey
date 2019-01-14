import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

// TODO: improve swipe feature: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
export class Carousel implements IRenderable {

    public spec: ISpecification;

    private count: number;
    private counter: number = 0;
    private touchstartX: number = 0;
    private touchendX: number = 0;

    constructor(message: ISpecification) {
        this.spec = message;
        this.count = (message.elements || []).length;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const carousel = document.createElement('div');
        carousel.classList.add('lto-carousel', 'lto-left');

        const elements = (this.spec.elements || []).map(e => renderer.render(e, "carousel"));
        elements.forEach(e => e.forEach(x => carousel.appendChild(x)));

        if (carousel.children[this.counter]) {
            carousel.children[this.counter].classList.add('lto-active');
        }

        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('lto-button-group');
        for (let i = 0; i < this.count; i++) {
            const goto = document.createElement('button');
            goto.classList.add('lto-goto');
            goto.addEventListener('click', this.goto.bind(this, i));

            buttonGroup.appendChild(goto);
        }

        carousel.addEventListener('touchstart', this.touchStart.bind(this), false);
        carousel.addEventListener('touchend', this.touchEnd.bind(this), false);
        carousel.addEventListener('mousedown', this.mouseDown.bind(this), false);
        carousel.addEventListener('mouseup', this.mouseUp.bind(this), false);

        carousel.appendChild(buttonGroup);

        return carousel;
    }

    private goto(i: number, e: any) {
        const carousel = e.target.closest('.lto-carousel');
        const slides = carousel.querySelectorAll('.lto-block');

        slides[this.counter].classList.replace('lto-active', 'lto-passive');

        this.counter = i;
        slides[this.counter].classList.add('lto-active');
        slides[this.counter].classList.replace('lto-passive', '');
    }

    private touchStart = (e: any) => this.touchstartX = e.changedTouches[0].screenX;
    private mouseDown = (e: any) => this.touchstartX = e.screenX;

    private touchEnd(e: any) {
        this.touchendX = e.changedTouches[0].screenX;
        this.swipe(e);
    }

    private mouseUp(e: any) {
        this.touchendX = e.screenX;
        this.swipe(e);
    }

    private swipe(e: any) {
        if (this.touchendX > this.touchstartX) {
            // right
            const i = (this.counter === (this.count - 1)) ? 0 : (this.counter + 1);
            this.goto(i, e);
        } else {
            // left
            const i = (this.counter === 0) ? (this.count - 1) : (this.counter - 1);
            this.goto(i, e);
        }
    }

}