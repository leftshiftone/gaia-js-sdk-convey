import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {MarkupComponent} from '../markup-component';

export class Block extends MarkupComponent {

  public message: any;
  public position: string;

  constructor(message: any) {
    super('block');
    this.message = message;
    this.position = message.position;
  }

  public render(container: any, sendMessage: any) {
    const position = this.position || 'left';
    const block = document.createElement('div');
    block.classList.add('block');
    block.classList.add(position);
    block.appendChild(Timestamp.render());
    this.renderElements(block, this.message, sendMessage);
    if (!Block.isNested(container)) {
      container.appendChild(new Icon(position).render());
      block.classList.add('nested');
    }
    container.appendChild(block);
  }

}
