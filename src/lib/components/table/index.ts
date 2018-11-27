import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {MarkupComponent} from '../markup-component';

export class Table extends MarkupComponent {

    public message: any;
    public position: string;

    constructor(message: any) {
        super('table');
        this.message = message;
        this.position = message.position;
    }

    public render(container: any, sendMessage: any) {
        const table = document.createElement('table');
        if (!Table.isNested(container)) {
            const position = this.position || 'left';
            table.classList.add('table', position);
            table.appendChild(Timestamp.render());
            this.renderElements(table, this.message, sendMessage);
            container.appendChild(new Icon(position).render());
        } else {
            table.classList.add('table-nested');
            this.renderElements(table, this.message, sendMessage);
        }
        container.appendChild(table);
    }
}
