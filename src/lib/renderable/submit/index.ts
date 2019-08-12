import {IRenderer, ISpecification,IRenderable} from '../../api';
import EventStream from '../../event/EventStream';
import Renderables from '../Renderables';
import {closestByClass} from "../../support/Elements";
import {Button} from "../button";
import {InputContainer} from "../../support/InputContainer";
import node from "../../support/node";
import {Overlay} from "../overlays/Overlay";

export class Submit implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const submit: HTMLButtonElement = document.createElement('button');

        submit.classList.add("lto-submit", "lto-" + position);
        if (this.spec.id !== undefined) {
            submit.id = this.spec.id;
        }

        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => submit.classList.add(e));
        }

        if (isNested) {
            submit.classList.add("lto-nested");
        }
        submit.appendChild(document.createTextNode(this.spec.text || ""));

        const text = this.spec.text || "";
        const timestamp = this.spec.timestamp || "";
        submit.addEventListener("click", () => {
            let attributes: Attr = {} as Attr;

            // FIXME: use generic class name e.g. message-content
            const content = closestByClass(submit, ["lto-form"]);

            // put in exception for overlay
            const overlay = node(submit).getParentByClass("lto-overlay");

            if(overlay) {
                const form = overlay.unwrap().querySelector(".lto-form");
                if(!form) return;
                const trigger = content.querySelector(`.lto-trigger[name=${overlay.getAttribute("trigger")}]`);
                if(!trigger) return;
                trigger.setAttribute("value", JSON.stringify(InputContainer.getAll(form as HTMLFormElement)));
                Overlay.hide(overlay);
                return;
            }
            attributes.appendChild(InputContainer.getAll(content as HTMLFormElement));

            if (Object.keys(attributes).length > 0) {
                submit.disabled = true;
                content.style.pointerEvents = "none";

                EventStream.emit("GAIA::publish", {
                    timestamp,
                    text,
                    attributes: {type: "submit", value: JSON.stringify(attributes)},
                    type: "submit",
                    position: "right"
                });

                Button.cleanupButtons();
            }
        });

        return submit;
    }

}

Renderables.register("submit", Submit);
