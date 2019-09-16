import {IRenderable, IRenderer, ISpecification} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";
import {InputContainer} from "../../support/InputContainer";

/**
 * Implementation of the 'phone' markup element.
 * An input HTML element is created and the given attributes name and
 * value are taken over from the markup. The class lto-phone is added
 * to allow CSS manipulations and a change listener is added.
 *
 * @see {@link IRenderable}
 */
export class Phone implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const phone = node('input');
        phone.addClasses("lto-phone", "lto-" + position);
        phone.addAttributes({
            type: "tel",
            placeholder: this.spec.placeholder || "",
            name: this.spec.name || "",
            value: this.spec.value || "",
        });
        InputContainer.setRequiredAttribute(phone.unwrap(), this.spec.required)

        if (isNested)
            phone.addClasses("lto-nested");

        if (this.spec.id !== undefined)
            phone.addAttributes({id: this.spec.id});

        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => phone.addClasses(e));

        phone.unwrap().addEventListener("change", () =>
            phone.addAttributes({'value': (phone.unwrap() as HTMLInputElement).value})
        );

        return phone.unwrap();
    }
}

Renderables.register("phone", Phone);
