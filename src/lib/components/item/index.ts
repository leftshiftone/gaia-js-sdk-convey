import {MarkupComponent} from '../markup-component';

export class Item extends MarkupComponent {

  public text: string;

  constructor(message: any) {
    super('item');
    this.text = message.text;
  }

  public render(container: HTMLElement) {
    const item = document.createElement('li');
    item.classList.add('item');
    item.appendChild(document.createTextNode(this.text));
    container.appendChild(item);
  }
}
