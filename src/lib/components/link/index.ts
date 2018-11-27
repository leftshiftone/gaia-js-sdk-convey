import { MarkupComponent } from '../markup-component';

export class Link extends MarkupComponent {

  public text: string;
  public value: string;

  constructor(message: any) {
    super('link');
    this.text = message.text;
    this.value = message.value;
  }

  public render(container: any) {
    const link = document.createElement('a');
    link.setAttribute('href', this.value);
    link.setAttribute('target', '_blank');
    link.classList.add('link');
    link.appendChild(document.createTextNode(this.text));
    container.appendChild(link);
  }

}
