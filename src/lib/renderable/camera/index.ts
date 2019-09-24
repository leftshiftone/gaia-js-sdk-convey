import {IRenderable, IRenderer, ISpecification, IStackeable} from '../../api';
import Renderables from '../Renderables';
import {drawCanvas} from "../../support/Canvas";
import {getUserVideoMedia} from "../../support/Navigator";
import {getBase64FromFile} from "../../support/Files";
import {InputContainer} from "../../support/InputContainer";

/**
 * Implementation of the 'camera' markup element.
 * A HTML video element is used to create a camera.
 * For CSS manipulations the following classes are added:
 *  lto-camera: the camera container
 *  lto-take-photo: is used for taking a photo. The photo will be displayed in the canvas below the video element
 *  lto-reset-photo: is enabled when photo is taken. A click on this div, resets the camera
 *
 * @see {@link IRenderable}
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
     * @inheritDoc
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.classList.add("lto-camera");
        wrapper.setAttribute("name", this.spec.name || "");
        InputContainer.setRequiredAttribute(wrapper, this.spec.required);
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

            wrapper.setAttribute("data-value", JSON.stringify({
                data: canvas.toDataURL().split(",")[1],
                fileExtension: "png",
                mimeType: "image/png"
            }));

            if (this.spec.maxCompressSize) {
                console.info(`Using image compression with ${this.spec.maxCompressSize}MB`);
                this.compressCameraImage(canvas, wrapper)
                    .catch(reason => console.error(`Unable to compress image: ${reason}`));
            }

            this.activateResetButton(wrapper);
            Camera.deactivateClick(photoButton);
        };
        photoButton.classList.toggle("lto-disabled");
    }

    private async compressCameraImage(canvas: HTMLCanvasElement, wrapper: HTMLDivElement) {
        console.info(`Attempt to comress image with max. compress size ${this.spec.maxCompressSize}`);

        let imageCompression = typeof window !== "undefined" ? require("browser-image-compression/dist/browser-image-compression") : null;
        if (!imageCompression) return;

        (imageCompression.getFilefromDataUrl(canvas.toDataURL()) as Promise<File>)
            .then((uncompressedFile: File) => {
                console.debug("Got file from data url");
                if (!uncompressedFile) return;

                const options = {
                    maxSizeMB: this.spec.maxCompressSize,
                    useWebWorker: false,
                    maxWidthOrHeight: 974
                };
                imageCompression.default(uncompressedFile, options)
                    .then((compressedFile: File) => {
                        console.debug(`Compressed object is instanceof Blob: ${compressedFile instanceof Blob}`);
                        console.info(`Compressed to size ${compressedFile.size / 1024 / 1024} MB`);

                        wrapper.setAttribute("value", JSON.stringify({
                            data: getBase64FromFile(compressedFile),
                            fileExtension: "png",
                            mimeType: "image/png"
                        }));
                    }).catch((reason: any) => console.error(`Unable to compress file: ${reason}`));
            })
            .catch(reason => console.error(`Unable to get file from data url: ${reason}`));
    }

    private activateResetButton(wrapper: HTMLDivElement) {
        const resetButton = wrapper.querySelector(".lto-reset-photo") as HTMLDivElement;
        resetButton.onclick = () => {
            wrapper.removeAttribute("data-value");
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
