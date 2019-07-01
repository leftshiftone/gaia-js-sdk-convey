import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import node from "../../support/node";
import {Scanner} from "./Scanner";
import Result from "@zxing/library/esm5/core/Result";
import {getUserVideoMedia} from "../../support/Navigator";
import {drawCanvas} from "../../support/Canvas";

/**
 * Implementation of the 'codeReader' markup element.
 */
export class CodeReader implements IRenderable {

    private readonly spec: ISpecification;
    private mediaStream?: MediaStream;
    private maxCanvasSize = 640;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const wrapper = node("div");
        const video = node("video");
        const canvas = node("canvas");
        const controlWrapper = node("div");
        const resetButton = node("div");
        const successLabel = node("div");

        wrapper.addAttributes({
            id: this.spec.id || "",
            name: this.spec.name || "",
            class: "lto-code-reader"
        });

        resetButton.addClasses("lto-reset-button", "lto-disabled");
        successLabel.addClasses("lto-read-success");

        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => wrapper.addClasses(e));

        controlWrapper.appendChild(resetButton);
        wrapper.appendChild(video);
        wrapper.appendChild(canvas);
        wrapper.appendChild(controlWrapper);
        wrapper.appendChild(successLabel);

        this.initCamera(wrapper.unwrap());

        return wrapper.unwrap();
    }

    private initCamera(wrapper: HTMLElement) {
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
                this.mediaStream.getVideoTracks();
                video.play()
                    .then(() => {
                        if (!video.classList.contains("lto-active"))
                            video.classList.add("lto-active");
                        canvas.classList.remove("lto-active");
                        this.activateScanner(wrapper);
                    });
            })
            .catch(error => {
                console.error(error);
                video.classList.remove("lto-active");
                canvas.classList.remove("lto-active");
                const errorWrapper = wrapper.querySelector(".lto-error") as HTMLDivElement;
                errorWrapper.style.display = "block";
                wrapper.classList.add("lto-not-available");
            });
    }


    public static disableResetButton(wrapper: HTMLElement) {
        const resetButton = wrapper.querySelector<HTMLDivElement>(".lto-reset-button");
        if (resetButton) {
            resetButton.classList.remove("lto-active");
            resetButton.classList.add("lto-disabled");
        }
    }

    public activateResetButton(wrapper: HTMLElement) {
        const resetButton = wrapper.querySelector<HTMLDivElement>(".lto-reset-button");
        const successLabel = wrapper.querySelector(".lto-read-success") as HTMLElement;
        if (!resetButton) {
            return
        }
        resetButton.classList.remove("lto-disabled");
        resetButton.classList.add("lto-active");
        resetButton.onclick = () => {
            wrapper.classList.remove("lto-success");
            wrapper.removeAttribute("value");
            successLabel.innerText = "";
            CodeReader.disableResetButton(wrapper);
            this.initCamera(wrapper);
        }
    }

    public publishResult(wrapper: HTMLElement, result: Promise<Result> | null) {
        if (result !== null) {
            result.then(result => {
                const text = result.getText();
                const successLabel = wrapper.querySelector(".lto-read-success") as HTMLElement;
                if (successLabel) {
                    successLabel.innerText = text;
                }
                wrapper.classList.add("lto-success");
                wrapper.setAttribute("value", text);
                this.activateResetButton(wrapper);
                this.stopCamera(wrapper);
            })
        } else {
            console.error("Failed to publish result");
        }
    }

    private activateScanner(wrapper: HTMLElement) {
        const video = wrapper.querySelector("video") as HTMLVideoElement;
        const scanner = new Scanner();
        scanner.setDevice(video);
        wrapper.classList.remove("lto-success");

        let result;
        switch (this.spec.format) {
            case "qr":
                result = scanner.scanQRCode();
                break;
            case "bar":
                result = scanner.scanBarCode();
                break;
            default:
                console.error("Format: " + this.spec.format + " is not supported")
        }

        if (result) {
            this.publishResult(wrapper, result);
        }
    }

    private stopCamera(wrapper: HTMLElement) {
        const video = wrapper.querySelector("video") as HTMLVideoElement;
        video.classList.remove("lto-active");
        const canvas = wrapper.querySelector("canvas") as HTMLCanvasElement;
        canvas.classList.add("lto-active");
        drawCanvas(canvas, video, this.mediaStream||new MediaStream(), this.maxCanvasSize);
        this.mediaStream!.getTracks().forEach(track => track.stop());
    }

}

Renderables.register("codereader", CodeReader);
