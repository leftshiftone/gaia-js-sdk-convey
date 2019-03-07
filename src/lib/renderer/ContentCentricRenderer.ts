import {ClassicRenderer} from './ClassicRenderer';
import {IRenderable} from '../api/IRenderable';
import EventStream from '../event/EventStream';
import {Overlay} from '../renderable/overlay';
import {IStackeable} from '../api/IStackeable';
import {Block} from '../renderable/block';
import {Container} from '../renderable/container';

/**
 * The content centric renderer tries to maximize the time a content is visible by updating
 * the content if possible or displaying interrupting actions like intent cascading by overlaying the content.
 */
export class ContentCentricRenderer extends ClassicRenderer {

    private qualifier = null;
    private behaviour: (renderable: IRenderable, type?: IStackeable) => HTMLElement[] = (r, t) => this.defaultBehaviour(r, t);

    constructor(content: HTMLElement, suggest: HTMLElement) {
        super(content, suggest);
        EventStream.addListener("GAIA::publish", (e) => {
            if (e[0].type === "suggestion") {
                this.behaviour = this.suggestionBehaviour(this.qualifier || "");
            }
        });
    }

    protected renderElement(renderable: IRenderable, containerType?: IStackeable): HTMLElement[] {
        return this.behaviour(renderable, containerType);
    }

    private static getQualifier(renderable: IRenderable) {
        return (renderable["spec"] !== undefined) ? renderable["spec"].qualifier : null;
    }

    private defaultBehaviour(renderable: IRenderable, containerType?: IStackeable) {
        if (!containerType) {
            this.qualifier = ContentCentricRenderer.getQualifier(renderable) || this.qualifier;
        }
        return super.renderElement(renderable, containerType);
    }

    private suggestionBehaviour(qualifier?: string) {
        return (renderable: IRenderable, containerType?: IStackeable) => {
            if (ContentCentricRenderer.getQualifier(renderable) === qualifier) {
                const containers = document.getElementsByClassName("lto-container");
                const containerZ = containers[containers.length - 1];

                if (containerZ.parentElement) {
                    containerZ.parentElement.removeChild(containerZ);
                }

                this.behaviour = (r, t) => this.defaultBehaviour(r, t);
                return super.renderElement(renderable, containerType);
            }
            if (renderable instanceof Container) {
                return super.renderElement(new Overlay(renderable), new Block({type: "block"}));
            }
            return super.renderElement(renderable, new Block({type: "block"}));
        };
    }

}
