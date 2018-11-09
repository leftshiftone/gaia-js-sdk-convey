import {MarkupComponent} from '../markup-component';
import {Timestamp} from '../timestamp';
import {Icon} from '../icon';

export class Items extends MarkupComponent {

  public message: any;

  constructor(message: any) {
    super('items');
    this.message = message;
  }

  public render(container: HTMLElement, sendMessage: (msg: any) => void) {
    if (!Items.isNested(container)) {
      const div = document.createElement('div');
      div.classList.add('items');
      div.appendChild(Timestamp.render());

      const items = document.createElement('ul');
      div.appendChild(items);

      this.renderElements(items, this.message, sendMessage);
      container.appendChild(new Icon(this.message.position || 'left').render());
      container.appendChild(div);
    } else {
      const items = document.createElement('ul');
      this.renderElements(items, this.message, sendMessage);
      container.appendChild(items);
    }
  }

}
