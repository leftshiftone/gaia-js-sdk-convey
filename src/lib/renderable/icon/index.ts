import {IRenderable} from '../../api';

/**
 * Implementation of the 'icon' markup element.
 * A div HTML element is created and the class
 * lto-icon is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 */
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
