import {IRenderable} from '../../api';

export class Icon implements IRenderable{

    public position: string;

    constructor(position: string) {
        this.position = position;
    }

    public render() {
        const icon = document.createElement('div');
        icon.classList.add('lto-icon', "lto-" + this.position);
        return icon;
    }

}
