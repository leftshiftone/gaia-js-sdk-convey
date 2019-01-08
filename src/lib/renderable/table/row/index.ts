import {AbstractRenderable} from '../../AbstractRenderable';
import {IRenderer} from '../../../api/IRenderer';

export class Row extends AbstractRenderable {

    public message: any;

    constructor(message: any) {
        super('row');
        this.message = message;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const row = document.createElement('tr');
        row.classList.add('row');
        this.renderElements(renderer, row, this.message, sendMessage);
        container.appendChild(row);
    }

}
