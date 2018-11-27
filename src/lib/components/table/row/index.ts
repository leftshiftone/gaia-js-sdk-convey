import {MarkupComponent} from '../../markup-component';

export class Row extends MarkupComponent {

    public message: any;

    constructor(message: any) {
        super('row');
        this.message = message;
    }

    public render(container: any, sendMessage: any) {
        const row = document.createElement('tr');
        row.classList.add('row');
        this.renderElements(row, this.message, sendMessage);
        container.appendChild(row);
    }

}
