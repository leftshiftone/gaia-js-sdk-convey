import {MarkupComponent} from '../markup-component';

export class Bold extends MarkupComponent {

  public text: string;

  constructor(message: any) {
    super('bold');
    this.text = message.text;
  }

  public render(container: any) {
    const bold = document.createElement('b');
    bold.classList.add('bold');
    bold.appendChild(document.createTextNode(this.text));
    container.appendChild(bold);
  }

}
