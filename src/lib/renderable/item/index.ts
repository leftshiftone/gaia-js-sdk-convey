import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Item extends AbstractRenderable {

    public text: string;

    constructor(message: any) {
        super('item');
        this.text = message.text;
    }

    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const item = document.createElement('li');
        item.classList.add('item');
        item.appendChild(document.createTextNode(this.text));

        return item;
    }
}
