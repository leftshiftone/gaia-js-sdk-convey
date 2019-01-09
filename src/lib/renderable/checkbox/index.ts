import node from '../../support/node';
import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer, ISpecification} from '../../api/IRenderer';

export class Checkbox extends AbstractRenderable {

    private readonly message:ISpecification;

    constructor(message: ISpecification) {
        super('checkbox');
        this.message = message;
    }

    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const checkbox = node('input').addAttributes({type: 'checkbox', name: this.name});
        const label = node('label').addClasses('checkbox', this.message.position || "left");

        label.appendChild(checkbox);
        label.appendChild(this.message.text || "");
        label.onClick((e: MouseEvent) => {
            checkbox.toggle();
            label.toggleClass('toggle');
        });

        return label.unwrap();
    }

}
