import {IRenderer} from '../api/IRenderer';
import {IRenderable} from '../api/IRenderable';

export abstract class AbstractRenderable implements IRenderable {

    private static NESTED_ELEMENTS = ["block", "carousel", "col"];

    public static isNested(container: any) {
        return AbstractRenderable.NESTED_ELEMENTS.find(e => container.classList.contains(e)) !== undefined;
    }

    public name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    public renderElements(renderer:IRenderer, component: HTMLElement, message: any, sendMessage: (msg: any) => void) {
        Array.from(message.elements)
            .map(e => Object.assign(e, {position: (message.position || 'left')}))
            .forEach(e => renderer.render(e, sendMessage));
    }

    abstract render(renderer:IRenderer, container: HTMLElement, sendMessage?: (msg: any) => void): void;

}
