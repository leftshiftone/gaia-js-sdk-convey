import node from '../../support/node';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'checkbox' markup language.
 */
export class Checkbox implements IRenderable {

    private readonly spec:ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean):HTMLElement {
        let isChecked: boolean = this.spec.checked === "true";
        const checkbox = node('input').addAttributes({type: 'checkbox', name: this.spec.name || "", value: JSON.stringify({
                [this.spec.value || ""]: isChecked
            })});
        const label = node('label').addClasses('lto-checkbox', "lto-" + (this.spec.position || "left"));

        if(this.spec.checked === "true") {
            checkbox.toggle();
            label.toggleClass('lto-toggle');
        }

        if (this.spec.class !== undefined) label.addClasses(this.spec.class);

        label.appendChild(checkbox);
        label.appendChild(this.spec.text || "");
        label.onClick((e: MouseEvent) => {
            isChecked = !isChecked;
            checkbox.toggle();
            label.toggleClass('lto-toggle');
            checkbox.addAttributes({value: JSON.stringify({value: this.spec.value, checked: isChecked})})
        });

        return label.unwrap();
    }

}
Renderables.register("checkbox", Checkbox);
