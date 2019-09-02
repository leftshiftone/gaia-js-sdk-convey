import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

/**
 * Implementation of the 'phone' markup element.
 */
export class Phone implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const phone = node('input');
        phone.addAttributes({
            type: "tel",
            placeholder: this.spec.placeholder || "",
            name: this.spec.name || "",
            value: this.spec.value || "",
        });

        phone.addDataAttributes({
            required: this.spec.required || "false"
        });

        phone.addClasses("lto-phone", "lto-" + position);

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
