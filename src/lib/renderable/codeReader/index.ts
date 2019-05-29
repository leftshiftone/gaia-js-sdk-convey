import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';
import node from "../../support/node";
import {Scanner} from "./Scanner";
import Result from "@zxing/library/esm5/core/Result";

/**
 * Implementation of the 'codeReader' markup element.
 */
export class CodeReader implements IRenderable, IStackeable {

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
        const photoButton = node("div");
        const successLabel = node("div");

        wrapper.addAttributes({
            id: "id",
            name: this.spec.name || "",
            class: "lto-code-reader"
        });

        photoButton.addClasses("lto-take-photo", "lto-disabled");
        successLabel.addClasses("lto-read-success");

        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => wrapper.addClasses(e))

        if (isNested)
            wrapper.addClasses('lto-nested');

        controlWrapper.appendChild(photoButton);
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
                            this.activatePhotoButton(wrapper);
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

    public publishResult(wrapper: HTMLElement, result: Promise<Result> | null) {
        if(result !== null) {
            result.then(result => {
                const text = result.getText();
                const successLabel = wrapper.querySelector(".lto-read-success") as HTMLElement;
                if (successLabel) {
                    successLabel.innerText = text;
                }
                wrapper.classList.add("lto-success");
                wrapper.setAttribute("value", text);
            })
        } else {
            console.error("failed to publish result");
        }
    }

    private activatePhotoButton(wrapper: HTMLElement) {
        const video = wrapper.querySelector("video") as HTMLVideoElement;
        const scanner = new Scanner();
        scanner.setDevice(video);

        const photoButton = wrapper.querySelector(".lto-take-photo") as HTMLDivElement;

        photoButton.onclick = () => {
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

        };
        photoButton.classList.toggle("lto-disabled");
    }

}

Renderables.register("codeReader", CodeReader);
