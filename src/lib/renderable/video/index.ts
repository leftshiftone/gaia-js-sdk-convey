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
        video.addClasses("lto-video", "lto-left", isNested ? "lto-nested" : "", this.spec.class !== undefined ? this.spec.class : "");
        video.addAttributes({controls: true, src: this.spec.src});
        return video.unwrap();
    }
}
Renderables.register("video", Video);
