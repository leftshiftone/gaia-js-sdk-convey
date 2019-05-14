import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';

/**
 * Implementation of the 'camera' markup element.
 */
export class Camera implements IRenderable, IStackeable {
    private readonly spec: ISpecification;

    private mediaStream: MediaStream | null = null;
    private imageCapture: ImageCapture | null = null;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.classList.add("lto-camera");
        wrapper.setAttribute("name", this.spec.name || "");

        const video = document.createElement("video") as HTMLVideoElement;
        video.width = 480;
        video.height = 480;
        video.autoplay = true;

        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.width = 480;
        canvas.height = 480;

        const resetButton = document.createElement("div");
        resetButton.classList.add("lto-reset-photo", "lto-disabled");

        const photoButton = document.createElement("div");
        photoButton.classList.add("lto-take-photo", "lto-disabled");

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => wrapper.appendChild(x)));

        wrapper.appendChild(video);
        wrapper.appendChild(canvas);
        wrapper.appendChild(photoButton);
        wrapper.appendChild(resetButton);

        this.initCamera(wrapper);
        this.activatePhotoButton(wrapper);

        return wrapper;
    }

    private initCamera(div: HTMLDivElement) {
        const video = div.querySelector("video") as HTMLVideoElement;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then(mediaStream => {
                    this.mediaStream = mediaStream;
                    video.srcObject = mediaStream;
                    this.imageCapture = new ImageCapture(mediaStream.getVideoTracks()[0]);
                })
                .catch(error => console.error(error));
        }
    }

    private takePhoto(div: HTMLDivElement) {
        const canvas = div.querySelector("canvas") as HTMLCanvasElement;
        this.imageCapture!.takePhoto()
            .then(blob => createImageBitmap(blob))
            .then(imageBitmap => {
                Camera.drawCanvas(canvas, imageBitmap);
            })
            .finally(() => this.stopCamera(div))
            .catch(error => console.error(error))
    }

    private stopCamera(div: HTMLDivElement) {
        this.mediaStream!.getTracks().forEach(track => track.stop());
    }

    private static drawCanvas(canvas: HTMLCanvasElement, image: ImageBitmap) {
        canvas.width = Number(getComputedStyle(canvas).width!.split("px")[0]);
        canvas.height = Number(getComputedStyle(canvas).height!.split("px")[0]);
        const ratio = Math.min(canvas.width / image.width, canvas.height / image.height);

        const scaledWidth = image.width * ratio;
        const scaledHeight = image.height * ratio;

        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext("2d")!.drawImage(image, 0, 0, image.width, image.height, x, y, scaledWidth, scaledHeight);
    }

    private activatePhotoButton(wrapperElement: HTMLDivElement) {
        const photoButton = wrapperElement.querySelector(".lto-take-photo") as HTMLDivElement;
        photoButton.onclick = () => {
            this.takePhoto(wrapperElement);
            const canvas = wrapperElement.querySelector("canvas") as HTMLCanvasElement;
            wrapperElement.setAttribute("value", canvas.toDataURL());
            this.activateResetButton(wrapperElement);
            Camera.deactivateClick(photoButton);
        };
        photoButton.classList.toggle("lto-disabled");
    }

    private activateResetButton(wrapperElement: HTMLDivElement) {
        const resetButton = wrapperElement.querySelector(".lto-reset-photo") as HTMLDivElement;
        resetButton.onclick = () => {
            this.initCamera(wrapperElement);
            const canvas = wrapperElement.querySelector("canvas") as HTMLCanvasElement;
            canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
            this.activatePhotoButton(wrapperElement);
            Camera.deactivateClick(resetButton);
        };
        resetButton.classList.toggle("lto-disabled");
    }

    private static deactivateClick(element: HTMLDivElement) {
        element.onclick = null;
        element.classList.toggle("lto-disabled");
    }
}

Renderables.register("camera", Camera);
