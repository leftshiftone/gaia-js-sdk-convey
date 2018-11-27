import { MarkupComponent } from '../markup-component';

export class Break extends MarkupComponent {

  constructor() {
    super('break');
  }

  public render(container: any) {
    const br = document.createElement('br');
    container.appendChild(br);
  }

}
