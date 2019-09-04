import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

/**
 * Implementation of the 'video' markup element.
 * @author patrick.arbeiter@leftshift.one
 */
export class Video implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const video = node("video");
        video.setId(this.spec.id);
        video.addClasses("lto-video", "lto-left");
        video.addAttributes({controls: true, src: this.spec.src});
        this.spec.class !== undefined ? video.addClasses(this.spec.class) : () => {};
        if(isNested) video.addClasses("lto-nested");
        return video.unwrap();
    }
}
Renderables.register("video", Video);
