import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';
import {drawCanvas} from "../../support/Canvas";
import {getUserVideoMedia} from "../../support/Navigator";
import {dataURLToFile, getBase64FromFile} from "../../support/Files";

let imageCompression: any = null;

if (typeof window !== "undefined") {
    imageCompression = require("browser-image-compression/dist/browser-image-compression");
}

/**
 * Implementation of the 'camera' markup element.
 */
export class Camera implements IRenderable, IStackeable {
    private readonly maxCanvasSize: number;
    private readonly spec: ISpecification;

    private mediaStream?: MediaStream;

    constructor(message: ISpecification) {
        this.maxCanvasSize = 640;
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.classList.add("lto-camera");
        wrapper.setAttribute("name", this.spec.name || "");

        const error = document.createElement("div");
        error.classList.add("lto-error");
        error.style.display = "none";
        wrapper.appendChild(error);

        const video = document.createElement("video") as HTMLVideoElement;
        wrapper.appendChild(video);

        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        wrapper.appendChild(canvas);

        const controlWrapper = document.createElement("div");

        const photoButton = document.createElement("div");
        photoButton.classList.add("lto-take-photo", "lto-disabled");
        controlWrapper.appendChild(photoButton);

        const resetButton = document.createElement("div");
        resetButton.classList.add("lto-reset-photo", "lto-disabled");
        controlWrapper.appendChild(resetButton);

        wrapper.appendChild(controlWrapper);

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => wrapper.appendChild(x)));

        this.initCamera(wrapper);
        this.activatePhotoButton(wrapper);

        return wrapper;
    }

    private initCamera(wrapper: HTMLDivElement) {
        const video = wrapper.querySelector("video") as HTMLVideoElement;
        const canvas = wrapper.querySelector("canvas") as HTMLCanvasElement;

        wrapper.classList.remove("lto-not-available");

        const userMedia = getUserVideoMedia();
        if (userMedia == null) {
            return;
        }

        userMedia.then(mediaStream => {
                this.mediaStream = mediaStream;
                video.srcObject = this.mediaStream;
                video.play()
                    .then(() => {
                        if (!video.classList.contains("lto-active")) {
                            video.classList.add("lto-active");
                        }
                        canvas.classList.remove("lto-active");
                    });
            })
            .catch(error => {
                console.error(error);
                video.classList.remove("lto-active");
                canvas.classList.remove("lto-active");
                const errorWrapper = wrapper.querySelector(".lto-error") as HTMLDivElement;
                errorWrapper.style.display = "block";
                wrapper.classList.add("lto-not-available");
                Camera.deactivateClick(wrapper.querySelector(".lto-take-photo") as HTMLDivElement);
                this.activateResetButton(wrapper);
            });
    }

    private takePhoto(wrapper: HTMLDivElement) {
        const canvas = wrapper.querySelector("canvas") as HTMLCanvasElement;
        const video = wrapper.querySelector("video") as HTMLVideoElement;
        drawCanvas(canvas, video, this.mediaStream || new MediaStream(), this.maxCanvasSize);
        this.stopCamera(wrapper)
    }

    private stopCamera(wrapper: HTMLDivElement) {
        const video = wrapper.querySelector("video") as HTMLVideoElement;
        video.classList.remove("lto-active");
        const canvas = wrapper.querySelector("canvas") as HTMLCanvasElement;
        canvas.classList.add("lto-active");
        this.mediaStream!.getTracks().forEach(track => track.stop());
    }

    private activatePhotoButton(wrapper: HTMLDivElement) {
        const photoButton = wrapper.querySelector(".lto-take-photo") as HTMLDivElement;
        photoButton.onclick = () => {
            this.takePhoto(wrapper);
            const canvas = wrapper.querySelector("canvas") as HTMLCanvasElement;

            wrapper.setAttribute("value", JSON.stringify({
                data: canvas.toDataURL().split(",")[1],
                fileExtension: "png",
                mimeType: "image/png"
            }));

            if (this.spec.maxCompressSize) {
                console.log("use image compression");
                this.compressCameraImage(canvas, wrapper);
            }

            this.activateResetButton(wrapper);
            Camera.deactivateClick(photoButton);
        };
        photoButton.classList.toggle("lto-disabled");
    }

    private async compressCameraImage(canvas: HTMLCanvasElement, wrapper : HTMLDivElement) {

        let uncompressedFile = dataURLToFile(canvas.toDataURL().split(",")[1], "uncompressFoto");

        console.debug(uncompressedFile);
        console.debug(imageCompression);
        console.debug(this.spec.maxCompressSize);

        if (uncompressedFile && imageCompression) {

            const options = {
                maxSizeMB: this.spec.maxCompressSize,
                useWebWorker: false,
                maxWidthOrHeight: 974
            }

            //console.log(`uncompressedFile size ${uncompressedFile. / 1024 / 1024} MB`);

            const compressedFile = await imageCompression.default(uncompressedFile, options);
            console.debug('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.debug(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

            wrapper.setAttribute("value", JSON.stringify({
                data: getBase64FromFile(compressedFile),
                fileExtension: "png",
                mimeType: "image/png"
            }));

        }
    }


    private activateResetButton(wrapper: HTMLDivElement) {
        const resetButton = wrapper.querySelector(".lto-reset-photo") as HTMLDivElement;
        resetButton.onclick = () => {
            const errorWrapper = wrapper.querySelector(".lto-error") as HTMLDivElement;
            errorWrapper.style.display = "none";
            this.initCamera(wrapper);
            const canvas = wrapper.querySelector("canvas") as HTMLCanvasElement;
            canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
            this.activatePhotoButton(wrapper);
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
