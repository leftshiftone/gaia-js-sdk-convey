import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'email' markup element.
 */
export class Email implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const email = document.createElement('input');
        email.setAttribute("type", "email");
        email.setAttribute('name', this.spec.name || "");
        email.setAttribute('placeholder', this.spec.placeholder || "");
        email.classList.add("lto-email", "lto-" + position);
        if (isNested) {email.classList.add("lto-nested")}

        if(this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => email.classList.add(e));
        }

        email.required = Boolean(this.spec.required);

        email.addEventListener("change", () => {
            email.setAttribute('value', email.value);
        });

        return email;
    }
}

Renderables.register("email", Email);
