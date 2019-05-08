import {IRenderable} from "../../api/IRenderable";
import {IRenderer, ISpecification} from "../../api/IRenderer";
import {IStackeable} from "../../api/IStackeable";
import node from '../../support/node';
import Renderables from "../Renderables";

abstract class ChoiceContainer implements IStackeable {
    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const container = document.createElement("div");
        const children = this.spec.elements || [];

        children
            .map(child => this.mutateType(child))
            .map(child => renderer.render(child, this))
            .map(renderedChild => ChoiceContainer.unwrap(renderedChild))
            .filter((renderedChild: HTMLElement | undefined) => renderedChild !== undefined)
            .forEach(inputElement => container.appendChild(inputElement!!));

        return container;
    }

    abstract mutatedChoiceType(): string;

    private mutateType(spec: ISpecification): ISpecification {
        const clone = Object.assign({}, spec);
        clone["type"] = this.mutatedChoiceType();
        return clone as ISpecification;
    }

    private static unwrap(e: HTMLElement[]): HTMLElement | undefined {
        return (e != null && e.length) ? e[0] : undefined;
    }
}

export class SingleChoice extends ChoiceContainer {
    mutatedChoiceType(): string {
        return "radioChoice";
    }
}

export class MultipleChoice extends ChoiceContainer {
    mutatedChoiceType(): string {
        return "checkboxChoice";
    }
}


abstract class Choice implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const choiceNode = node("div");
        const input = node("input").addAttributes({
            type: this.inputType(),
            name: this.spec.type,
            value: this.spec.name
        });

        const label = node("label");
        label.appendChild(this.spec.text || "");
        label.appendChild(input);
        choiceNode.appendChild(label);

        return choiceNode.unwrap();
    }

    abstract inputType(): "radio" | "checkbox";

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
