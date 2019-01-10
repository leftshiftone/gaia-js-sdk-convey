import {IRenderable} from '../../api/IRenderable';

export class Icon implements IRenderable{

    public position: string;

    constructor(position: string) {
        this.position = position;
    }

    public render() {
        const icon = document.createElement('div');
        icon.classList.add('icon', this.position);
        return icon;
    }

}
