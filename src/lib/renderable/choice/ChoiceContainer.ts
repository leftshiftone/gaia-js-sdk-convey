import {IRenderer, ISpecification,IStackeable} from "../../api";
import node from "../../support/node";
import {ChoiceMutator} from "./ChoiceMutator";

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

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
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

        ChoiceMutator.mutate(children, this.mutatedChoiceType());

        children
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

    /**
     * Attached to class list of the container element
     */
    abstract cssClassName(): string;



    private static unwrap(e: HTMLElement[]): HTMLElement | undefined {
        return (e != null && e.length) ? e[0] : undefined;
    }
}
