import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';
import node from "../../support/node";

/**
 * Implementation of the 'video' markup element
 * The video element is used to display video files
 */
export class Video implements IRenderable {

    private readonly spec: ISpecification;

    /**
     * Constructor
     * @param spec evaluated specifications are:
     *      src: includes the URL to the video file
     */
    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     * The render method receives the video markup and creates an HTML element.
     *
     * Class which is set per default: <b>lto-video</b>
     *
     * @param renderer can render furthermore nested elements if they exist
     * @param isNested if the HTML element is nested
     *
     * @returns {@link HTMLVideoElement} DOM representation of the video markup
     */
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
