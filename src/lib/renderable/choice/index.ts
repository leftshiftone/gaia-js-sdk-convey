import Renderables from "../Renderables";
import {ChoiceContainer} from "./ChoiceContainer";
import {Choice} from "./Choice";


export class SingleChoice extends ChoiceContainer {
    cssClassName(): string {
        return "single-choice";
    }

    mutatedChoiceType(): string {
        return "radioChoice";
    }
}

export class MultipleChoice extends ChoiceContainer {
    cssClassName(): string {
        return "multiple-choice";
    }

    mutatedChoiceType(): string {
        return "checkboxChoice";
    }
}

export class RadioChoice extends Choice {
    inputType(): "radio" | "checkbox" {
        return "radio";
    }
}

export class CheckboxChoice extends Choice {
    inputType(): "radio" | "checkbox" {
        return "checkbox";
    }
}

Renderables.register("singlechoice", SingleChoice);
Renderables.register("multiplechoice", MultipleChoice);
Renderables.register("radioChoice", RadioChoice);
Renderables.register("checkboxChoice", CheckboxChoice);
