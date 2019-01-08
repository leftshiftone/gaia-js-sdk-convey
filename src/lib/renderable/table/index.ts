import {Icon} from '../icon';
import {Timestamp} from '../timestamp';
import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Table extends AbstractRenderable {

    public message: any;
    public position: string;

    constructor(message: any) {
        super('table');
        this.message = message;
        this.position = message.position;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const table = document.createElement('table');
        if (!Table.isNested(container)) {
            const position = this.position || 'left';
            table.classList.add('table', position);
            table.appendChild(Timestamp.render());
            this.renderElements(renderer, table, this.message, sendMessage);
            container.appendChild(new Icon(position).render());
        } else {
            table.classList.add('table-nested');
            this.renderElements(renderer, table, this.message, sendMessage);
        }
        container.appendChild(table);
    }
}
