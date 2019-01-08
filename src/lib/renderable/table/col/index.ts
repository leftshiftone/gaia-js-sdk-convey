import {AbstractRenderable} from '../../AbstractRenderable';
import {IRenderer} from '../../../api/IRenderer';

export class Col extends AbstractRenderable {

    public message: any;

    constructor(message: any) {
        super('col');
        this.message = message;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const col = document.createElement('td');
        col.classList.add('col');
        this.renderElements(renderer, col, this.message, sendMessage);
        container.appendChild(col);
    }
}
