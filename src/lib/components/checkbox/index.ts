import node from '../../support/node';
import {MarkupComponent} from '../markup-component';

export class Checkbox extends MarkupComponent {

  public text: string;
  public value: string;
  public position: string;

  constructor(message: any) {
    super('checkbox');
    this.text = message.text;
    this.value = message.value;
    this.position = message.position || 'left';
  }

  public render(container: any) {
    const checkbox = node('input').addAttributes({ type: 'checkbox', name: this.name });
    const label = node('label').addClasses('checkbox', this.position);

    label.appendChild(checkbox);
    label.appendChild(this.text);
    label.onClick((e: MouseEvent) => {
      checkbox.toggle();
      label.toggleClass('toggle');
    });

    container.appendChild(label.unwrap());
  }

}
