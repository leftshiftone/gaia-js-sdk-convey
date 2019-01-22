import node from '../../support/node';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

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
        const checkbox = node('input').addAttributes({type: 'checkbox', name: this.spec.name || ""});
        const label = node('label').addClasses('lto-checkbox', "lto-" + (this.spec.position || "left"));
        if (this.spec.class !== undefined) checkbox.addClasses(this.spec.class);

        label.appendChild(checkbox);
        label.appendChild(this.spec.text || "");
        label.onClick((e: MouseEvent) => {
            checkbox.toggle();
            label.toggleClass('lto-toggle');
        });

        return label.unwrap();
    }

}
