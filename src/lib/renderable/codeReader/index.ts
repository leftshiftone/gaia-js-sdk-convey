import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import node from "../../support/node";
import {Scanner} from "./Scanner";
import Result from "@zxing/library/esm5/core/Result";

/**
 * Implementation of the 'codeReader' markup element.
 */
export class CodeReader implements IRenderable {

    private readonly spec: ISpecification;
    private mediaStream?: MediaStream;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const wrapper = node("div");
        const video = node("video");
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

        if (isNested)
            wrapper.addClasses('lto-nested');

        controlWrapper.appendChild(resetButton);
        wrapper.appendChild(video);
        wrapper.appendChild(controlWrapper);
        wrapper.appendChild(successLabel);

        this.initCamera(wrapper.unwrap());

        return wrapper.unwrap();
    }

    private initCamera(wrapper: HTMLElement) {
        const video = wrapper.querySelector("video") as HTMLVideoElement;

        wrapper.classList.remove("lto-not-available");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then(mediaStream => {
                    this.mediaStream = mediaStream;
                    video.srcObject = this.mediaStream;
                    this.mediaStream.getVideoTracks();
                    video.play()
                        .then(() => {
                            if (!video.classList.contains("lto-active"))
                                video.classList.add("lto-active");
                            this.activateScanner(wrapper);
                        });
                })
                .catch(error => {
                    console.error(error);
                    video.classList.remove("lto-active");
                    const errorWrapper = wrapper.querySelector(".lto-error") as HTMLDivElement;
                    errorWrapper.style.display = "block";
                    wrapper.classList.add("lto-not-available");
                });
        }
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
            this.activateScanner(wrapper);
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
        switch (this.spec.format) {
            case "qr":
                this.publishResult(wrapper, scanner.scanQRCode());
                break;
            case "bar":
                this.publishResult(wrapper, scanner.scanBarCode());
                break;
            default:
                break;
        }
    }

}

Renderables.register("codereader", CodeReader);
