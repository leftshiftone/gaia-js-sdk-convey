import { MarkupComponent } from '../markup-component';

// TODO: improve swipe feature: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
export class Carousel extends MarkupComponent {

  public timestamp: any;
  public message: any;
  public value: string;

  private count: number;
  private counter: number = 0;
  private touchstartX: number = 0;
  private touchendX: number = 0;

  constructor(message: any) {
    super('carousel');
    this.timestamp = message.timestamp;
    this.value = message.value;
    this.message = message;
    this.count = message.elements.length;
  }

  public render(container: any, sendMessage: any) {
    const carousel = document.createElement('div');
    carousel.classList.add('carousel', 'left');

    this.renderElements(carousel, this.message, sendMessage);
    if (carousel.children[this.counter]) {
      carousel.children[this.counter].classList.add('active');
    }

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');
    for (let i = 0; i < this.count; i++) {
      const goto = document.createElement('button');
      goto.classList.add('goto');
      goto.addEventListener('click', this.goto.bind(this, i));

      buttonGroup.appendChild(goto);
    }

    carousel.addEventListener('touchstart', this.touchStart.bind(this), false);
    carousel.addEventListener('touchend', this.touchEnd.bind(this), false);
    carousel.addEventListener('mousedown', this.mouseDown.bind(this), false);
    carousel.addEventListener('mouseup', this.mouseUp.bind(this), false);

    carousel.appendChild(buttonGroup);
    container.appendChild(carousel);
  }

  private goto(i: number, e: any) {
    console.log('goto ' + i);

    const carousel = e.target.closest('.carousel');
    const slides = carousel.querySelectorAll('.block');

    slides[this.counter].classList.replace('active', 'passive');

    this.counter = i;
    slides[this.counter].classList.add('active');
  }

  private touchStart(e: any) {
    this.touchstartX = e.changedTouches[0].screenX;
  }

  private mouseDown(e: any) {
    this.touchstartX = e.screenX;
  }

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
      const i = (this.counter == (this.count - 1)) ? 0 : (this.counter + 1);
      this.goto(i, e);
    } else {
            // left
      const i = (this.counter == 0) ? (this.count - 1) : (this.counter - 1);
      this.goto(i, e);
    }
  }

}
