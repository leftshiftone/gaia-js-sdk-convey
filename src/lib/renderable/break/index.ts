import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Break extends AbstractRenderable {

    constructor() {
        super('break');
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        const br = document.createElement('br');
        container.appendChild(br);
    }

}
