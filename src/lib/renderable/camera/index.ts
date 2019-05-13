import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';
import EventStream from "../../event/EventStream";

/**
 * Implementation of the 'camera' markup element.
 */
export class Camera implements IRenderable, IStackeable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        // container
        const div = document.createElement("div");
        div.classList.add("lto-camera");
        div.setAttribute("name", this.spec.name || "");

        // snap
        const snap = document.createElement("div");
        snap.classList.add("lto-snap");

        // video
        const video = document.createElement("video") as HTMLVideoElement;
        video.width = 640;
        video.height = 480;
        video.autoplay = true;

        // canvas
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.width = 640;
        canvas.height = 480;

        // overlay images
        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => div.appendChild(x)));

        div.appendChild(video);
        div.appendChild(canvas);
        div.appendChild(snap);

        this.initCamera(div);

        return div;
    }

    private initCamera(div: HTMLDivElement) {
        const video = div.querySelector("video") as HTMLVideoElement;
        const canvas = div.querySelector("canvas") as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const snap = div.querySelector(".lto-snap") as HTMLDivElement;

        // init video
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then(stream => {
                    video.srcObject = stream;
                    video.play();
                }).catch((e) => {
                    console.error(e.name + ": " + e.message);
                    EventStream.emit("GAIA::publish", {
                        attributes: {type: 'submit', value: JSON.stringify({[this.spec.name || "camera"]: "denied"})},
                        type: 'submit'
                    });
            });
        }

        // init overlay
        const images = div.querySelectorAll<HTMLImageElement>("img");

        // init snapshot
        snap.onclick = () => {
            context.drawImage(video,0, 0, video.width, video.height);
            div.setAttribute("value", context.canvas.toDataURL());
        };

        // init canvas
        this.draw(video, context, images);
    }

    private draw(video: HTMLVideoElement, context: CanvasRenderingContext2D, images: NodeListOf<HTMLImageElement>) {
        context.drawImage(video, 0, 0, 640, 480);
        images.forEach(image => context.drawImage(image, 0, 0, 640, 480));

        setTimeout(this.draw, 20, video, context, images);
    }

}

Renderables.register("camera", Camera);
