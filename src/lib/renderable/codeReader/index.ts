import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';
import node from "../../support/node";
import {Scanner} from "./Scanner";

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

    // @ts-ignore
    private handleBar(wrapper: HTMLElement, scanner: Scanner) {
        scanner.scanBarCode().then(result => {
            const text = result.getText();
            const successLabel = wrapper.querySelector(".lto-read-success") as HTMLElement;
            if (successLabel) {
                successLabel.innerText = text;
            }
            wrapper.setAttribute("value", text);
        })
    }

    private handleQr(wrapper: HTMLElement, scanner: Scanner) {
        scanner.scanQRCode().then(result => {
            const text = result.getText();
            const successLabel = wrapper.querySelector(".lto-read-success") as HTMLElement;
            if (successLabel) {
                successLabel.innerText = text;
            }
            wrapper.setAttribute("value", text);
        })
    }

    private activatePhotoButton(wrapper: HTMLElement) {
        const video = wrapper.querySelector("video") as HTMLVideoElement;
        const scanner = new Scanner(video);

        const photoButton = wrapper.querySelector(".lto-take-photo") as HTMLDivElement;

        photoButton.onclick = () => {
            switch (this.spec.format) {
                case "qr":
                    this.handleQr(wrapper, scanner);
                    break;
                case "bar":
                    break;
                default:
                    break;
            }

        };
        photoButton.classList.toggle("lto-disabled");
    }

}

Renderables.register("codeReader", CodeReader);
