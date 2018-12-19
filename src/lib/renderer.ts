import {MarkupComponent} from './components/markup-component';
import {components} from './Components';
import {Button} from "./components/button";

export class Renderer {

    private readonly container: any;

    constructor(container: any) {
        this.container = container;
    }

    public render(message: any, sendMessage: any) {
        const element = this.getElement(message);
        return Array.isArray(element) ?
            element.map(e => this.renderElement(e, sendMessage)) :
            this.renderElement(element, sendMessage);
    }

    public renderElement(element: MarkupComponent, sendMessage: any) {
        if (this.container) {
            element.render(this.container, sendMessage);

            if (element.name === 'button'){
                if ((element as Button).position !== 'right') {
                    return;
                }
            }
            
            const div = document.createElement('div');
            div.classList.add('separator');
            div.classList.add('separator-' + element.name);
            this.container.appendChild(div);
            
            
            const objDiv = document.querySelector('.gaia-chat .scrollbar');
            if (objDiv != null) {
                objDiv.scrollTop = objDiv.scrollHeight;
            }
        }
    }

    public getElement(message: any): MarkupComponent {
        if (message.type.toUpperCase() === 'CONTAINER') {
            return message.elements.map((element: any) => {
                return this.getElement(element);
            });
        }
        console.debug('Element message of type ' + message.type);
        const componentClass = components[message.type.toUpperCase()];
        return new componentClass(message);
    }
}
