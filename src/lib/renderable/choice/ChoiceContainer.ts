import {IStackeable} from "../../api/IStackeable";
import {IRenderer, ISpecification} from "../../api/IRenderer";
import node from "../../support/node";

/**
 * Abstract choice container can be either multiple choice or single choice
 * @author benjamin.krenn@leftshift.one - 5/9/19.
 * @since 0.23.0
 */
export abstract class ChoiceContainer implements IStackeable {
    private readonly spec: ISpecification;
    public static readonly CSS_BASE_CLASS = "lto-choice-container";

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const container = node("div");
        this.spec.class ?
            container.addClasses(ChoiceContainer.CSS_BASE_CLASS, this.cssClassName(), this.spec.class)
            : container.addClasses(ChoiceContainer.CSS_BASE_CLASS, this.cssClassName());

        // add sieve and name as data attribute to maintain the information for the actual submit
        container.addDataAttributes({
            sieve: `${this.spec.sieve}`,
            name: `${this.spec.name}`
        });

        const children = this.spec.elements || [];
        children
            .map(child => this.mutateType(child))
            .map(child => renderer.render(child, this))
            .map(renderedChild => ChoiceContainer.unwrap(renderedChild))
            .filter((renderedChild: HTMLElement | undefined) => renderedChild !== undefined)
            .forEach(inputElement => container.appendChild(node(inputElement!!)));

        return container.unwrap();
    }


    /**
     * Mutated type to be used in {@link this#mutateType}
     */
    abstract mutatedChoiceType(): string;

    abstract cssClassName(): string;

    /**
     * Mutates the type of a choice element.
     * This is required to differ between radio buttons and checkboxes
     */
    private mutateType(spec: ISpecification): ISpecification {
        if (spec.type === "choice") {
            const clone = Object.assign({}, spec);
            clone["type"] = this.mutatedChoiceType();
            return clone as ISpecification;
        }
        return spec;
    }

    private static unwrap(e: HTMLElement[]): HTMLElement | undefined {
        return (e != null && e.length) ? e[0] : undefined;
    }
}
