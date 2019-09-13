import Renderables from "../Renderables";
import {ChoiceContainer} from "./ChoiceContainer";
import {Choice} from "./Choice";

/**
 * Single choice container consisting of a radio
 * check box. The class single-choice is added for
 * CSS manipulations.
 *
 * @see {@link ChoiceContainer}
 * @see {@link ChoiceMutator}
 */
export class SingleChoice extends ChoiceContainer {
    cssClassName(): string {
        return "single-choice";
    }

    mutatedChoiceType(): string {
        return "radioChoice";
    }
}

/**
 * Multi choice container consisting of check
 * boxes. The class multiple-choice is added for
 * CSS manipulations.
 *
 * @see {@link ChoiceContainer}
 * @see {@link ChoiceMutator}
 */
export class MultipleChoice extends ChoiceContainer {
    cssClassName(): string {
        return "multiple-choice";
    }

    mutatedChoiceType(): string {
        return "checkboxChoice";
    }
}

/**
 * Radio choice consisting of a radio check
 * box.
 *
 * @see {@link ChoiceContainer}
 * @see {@link ChoiceMutator}
 * @see {@link Choice}
 */
export class RadioChoice extends Choice {
    inputType(): "radio" | "checkbox" {
        return "radio";
    }
}

/**
 * Radio choice consisting of a radio check
 * box.
 *
 * @see {@link ChoiceContainer}
 * @see {@link ChoiceMutator}
 * @see {@link Choice}
 */
export class CheckboxChoice extends Choice {
    inputType(): "radio" | "checkbox" {
        return "checkbox";
    }
}

Renderables.register("singlechoice", SingleChoice);
Renderables.register("multiplechoice", MultipleChoice);
Renderables.register("radioChoice", RadioChoice);
Renderables.register("checkboxChoice", CheckboxChoice);
