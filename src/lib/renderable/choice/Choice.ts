import {IRenderable} from "../../api/IRenderable";
import {IRenderer, ISpecification} from "../../api/IRenderer";
import node from "../../support/node";

/**
 * Represents either a checkbox (multiple choice) or a radio button (single choice) element.
 *
 * @see RadioChoice && CheckboxChoice
 *
 * @author benjamin.krenn@leftshift.one - 5/9/19.
 * @since 0.23.0
 */
export abstract class Choice implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const choiceNode = node("div");
        const input = node("input").addAttributes({
            type: this.inputType(),
            name: "choice",
            value: this.spec.name
        });

        input.addDataAttributes({
            name: this.spec.name
        });

        if (this.spec.selected) {
            input.toggle();
        }

        const label = node("label");
        label.appendChild(this.spec.text || "");
        label.appendChild(input);
        this.spec.class !== undefined ? label.addClasses(this.spec.class) : () => {};
        if (this.inputType() === "radio") {
            input.unwrap().addEventListener("click", () => {
                label.unwrap().parentElement!.parentElement!.querySelectorAll('input[name=' + input.unwrap().getAttribute("name") + ']').forEach(e => {
                    e.parentElement!.classList.remove("lto-toggle", "lto-checked", "lto-unchecked");
                    e.parentElement!.classList.add("lto-unchecked");
                });
                label.addClasses("lto-toggle", "lto-checked");
                label.unwrap().classList.remove("lto-unchecked");
            });
        } else {
            input.unwrap().addEventListener("click", () => {
                label.toggleClass("lto-toggle");
            });
        }

        choiceNode.appendChild(label);

        return choiceNode.unwrap();
    }

    abstract inputType(): "radio" | "checkbox";
}
