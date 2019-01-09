import node from '../../support/node';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'checkbox' markup language.
 */
export class Checkbox implements IRenderable {

    private readonly message:ISpecification;

    constructor(message: ISpecification) {
        this.message = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        const checkbox = node('input').addAttributes({type: 'checkbox', name: this.message.name || ""});
        const label = node('label').addClasses('checkbox', this.message.position || "left");

        label.appendChild(checkbox);
        label.appendChild(this.message.text || "");
        label.onClick((e: MouseEvent) => {
            checkbox.toggle();
            label.toggleClass('toggle');
        });

        return label.unwrap();
    }

    public name = () => "checkbox";

}
