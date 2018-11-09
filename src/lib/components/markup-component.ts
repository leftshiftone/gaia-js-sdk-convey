import {Renderer} from '../renderer';

export abstract class MarkupComponent {

  public static isNested(container: any) {
    return /\bblock/.test(container.className)
        || container.classList.contains('carousel')
        || container.tagName === 'TD';
  }

  public name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  public renderElements(component: HTMLElement, message: any, sendMessage: (msg:any) => void) {
    const renderer = new Renderer(component);
    Array.from(message.elements)
            .map(e => Object.assign(e, { position: (message.position || 'left') }))
            .forEach(e => renderer.render(e, sendMessage));
  }

  abstract render(container: HTMLElement, sendMessage?: (msg:any) => void): void;

}
