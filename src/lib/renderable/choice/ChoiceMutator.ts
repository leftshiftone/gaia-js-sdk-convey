import {ISpecification} from "../../api";

export class ChoiceMutator {

    /**
     * Mutates choice elements depending on the concrete container implementation
     * singleChoiceContainer => radioChoice
     * multipleChoiceContainer => checkboxChoice
     * @param elements
     * @param type
     */
    static mutate(elements: ISpecification[], type: string) {
        ChoiceMutator.leafElements(elements, [])
            .map(child => ChoiceMutator.mutateType(child, type));
    }


    /**
     * Mutates the type of a choice element.
     * This is required to differ between radio buttons and checkboxes and should not be considered as
     * a good solution.
     */
    private static mutateType(spec: ISpecification, type: string): ISpecification {
        if (spec.type === "choice") {
            spec["type"] = type;
        }
        return spec;
    }

    /**
     * Recursively unpacks all leaf elements from the given {@link ISpecification[]}
     * @param specs
     * @param accumulator
     */
    private static leafElements(specs: ISpecification[], accumulator: ISpecification[]): ISpecification[] {
        return specs.reduce((acc, val) => {
            if (val.elements === undefined) {
                acc.push(val);
                return acc;
            }
            return ChoiceMutator.leafElements(val.elements, acc);
        }, accumulator);
    }
}
