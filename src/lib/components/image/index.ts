import {MarkupComponent} from '../markup-component';

export class Image extends MarkupComponent {

    public source: string;
    public text: string;
    public width: any;
    public height: any;

    constructor(message: any) {
        super('image');
        this.source = message.source;
        this.text = message.text;
        this.width = message.width || 'auto';
        this.height = message.height || 'auto';
    }

    public render(container: any) {
        const image = document.createElement('img');
        image.setAttribute('src', this.source);
        image.setAttribute('alt', this.text);
        image.setAttribute('width', this.width);
        image.setAttribute('height', this.height);
        image.classList.add('image');
        container.appendChild(image);
    }

}
