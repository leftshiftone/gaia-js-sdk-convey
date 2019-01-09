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

    abstract render(renderer: IRenderer, isNested: boolean): HTMLElement;

}
