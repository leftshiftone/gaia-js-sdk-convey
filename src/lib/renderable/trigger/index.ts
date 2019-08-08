import {IRenderer, IRenderable, ISpecification} from '../../api';
import node from "../../support/node";
import Renderables from "../Renderables";

/**
 * Implementation of the 'trigger' markup element.
 */
export class Trigger implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const trigger = node("div");
        trigger.addClasses("lto-tirgger");
        if(this.spec.id)
            trigger.addAttributes({
                id: this.spec.id
            });

        trigger.addAttributes({name: this.spec.name});
        if(this.spec.text)
            trigger.innerText(this.spec.text);

        trigger.onClick(() => {
            const overlay = this.getOverlayFromContainer(Trigger.getContainer(trigger.unwrap()));
            if(!overlay) {
                console.error(`No overlay with name ${this.spec.name} found`);
                return
            }
            Trigger.activateOverlay(overlay);

        });

        return trigger.unwrap();
    }


    private static activateOverlay(overlay: HTMLElement) {
        overlay.classList.remove("lto-inactive");
    }

    private getOverlayFromContainer(container?: HTMLElement): HTMLElement | undefined {
        if(!container) return;
        return container.querySelectorAll(`.lto-overlays .lto-overlay[name="${this.spec.name!}"]`).item(0) as HTMLElement;
    }

    private static getContainer(element: HTMLElement): HTMLElement | undefined {
        if(element.parentElement) {
            let parent = element.parentElement;
            while(parent) {
                if(parent.classList.contains("lto-container")){
                    return parent;
                }
                if(parent.parentElement) {
                    parent = parent.parentElement;
                } else {
                    return
                }
            }
        }
        return
    }

}

Renderables.register("trigger", Trigger);
