import {MarkupComponent} from '../../markup-component';

export class Col extends MarkupComponent {

    public message: any;

    constructor(message: any) {
        super('col');
        this.message = message;
    }

    public render(container: any, sendMessage: any) {
        const col = document.createElement('td');
        col.classList.add('col');
        this.renderElements(col, this.message, sendMessage);
        container.appendChild(col);
    }
}
