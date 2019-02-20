import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'phone' markup element.
 */
export class Phone implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const phone = document.createElement('input');
        phone.setAttribute("type", "tel");

        phone.setAttribute('name', this.spec.name || "");
        phone.setAttribute('required', this.spec.required !== undefined ? this.spec.required.toString() : "true");
        phone.setAttribute('placeholder', this.spec.placeholder || "");
        phone.setAttribute('pattern', "^[0-9-+s()]*$");

        phone.addEventListener("change", () => {
            if(phone.checkValidity()) {
                phone.setAttribute('value', phone.value);
            }
        });

        phone.classList.add("lto-phone", "lto-" + position);
        if (isNested) {phone.classList.add("lto-nested")}

        if(this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => phone.classList.add(e));
        }

        return phone;
    }
}

Renderables.register("phone", Phone);
