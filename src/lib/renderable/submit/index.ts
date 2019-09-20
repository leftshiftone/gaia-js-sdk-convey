import {IRenderable, IRenderer, ISpecification} from '../../api';
import EventStream from '../../event/EventStream';
import Renderables from '../Renderables';
import {closestByClass} from "../../support/Elements";
import {Button} from "../button";
import {InputContainer} from "../../support/InputContainer";
import {Overlay} from "../overlays/Overlay";
import node from "../../support/node";

/**
 * Implementation of the 'submit' markup element.
 * A button HTML element is created of type submit and has to be
 * part of a form element in the markup. The class
 * lto-submit is added to allow CSS manipulations.
 *
 * @see {@link IRenderable}
 * @see {@link Form}
 */
export class Submit implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const submit: HTMLButtonElement = document.createElement('button');
        submit.setAttribute(`type`, "submit");

        submit.classList.add("lto-submit", "lto-" + position);
        if (this.spec.id !== undefined)
            submit.id = this.spec.id;
        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => submit.classList.add(e));
        if (isNested)
            submit.classList.add("lto-nested");

        submit.appendChild(document.createTextNode(this.spec.text || ""));

        const text = this.spec.text || "";
        const timestamp = this.spec.timestamp || "";

        submit.addEventListener("click", (ev) => {
            ev.preventDefault();

            const overlay = closestByClass(submit, ["lto-overlay"]);
            const container = closestByClass(submit, ["lto-container"]);

            if (overlay && container) {
                this.handleOverlay(container, overlay);
                return;
            }

            const content = closestByClass(submit, ["lto-form"]);

            submit.disabled = true;
            if (content) content.style.pointerEvents = "none";
            InputContainer.getAll(content as HTMLFormElement, submit).then((attr) => {

                EventStream.emit("GAIA::publish", {
                    timestamp,
                    text,
                    attributes: {type: "submit", value: JSON.stringify(attr)},
                    type: "submit",
                    position: "right"
                });

                Button.cleanupButtons();
            }).catch((reason) => {
                console.error(`Unable to collect form input data: ${reason}`);
                submit.disabled = false;
                if (content) content.style.pointerEvents = "auto";
            })
        });

        return submit;
    }

    public handleOverlay(container: HTMLElement, overlay: HTMLElement) {
        const form = overlay.querySelector(".lto-form") as HTMLFormElement;
        const submit = overlay.querySelector(".lto-submit") as HTMLButtonElement;
        const trigger: HTMLElement | null = container.querySelector(`.lto-trigger[name="${overlay.getAttribute("name")}"]`);
        if (!trigger || !form) return;
        InputContainer.getAll(form, submit).then((attr) => {
            if (Object.keys(attr).length !== 0 && !trigger.classList.contains("lto-success")) {
                trigger.classList.add("lto-success");
                trigger.setAttribute("data-value", JSON.stringify(attr));
            } else if (Object.keys(attr).length === 0) {
                trigger.classList.remove("lto-success");
                if (trigger.hasAttribute("value"))
                    trigger.removeAttribute("value");
                else if (trigger.hasAttribute("data-value"))
                    trigger.removeAttribute("data-value");
            }
            Overlay.hide(node(overlay));
        }).catch(reason => {
            console.error(`Unable to collect form input data: ${reason}`);
            trigger.classList.remove("lto-success");
        })
    }
}

Renderables.register("submit", Submit);
