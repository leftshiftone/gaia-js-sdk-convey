import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import node, {INode} from "../../support/node";
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

        this.initCamera(wrapper);

        return wrapper.unwrap();
    }

    private initCamera(wrapper: INode) {
        const video = wrapper.find("video").unwrap() as HTMLVideoElement;
        const canvas = wrapper.find("canvas");

        wrapper.removeClasses("lto-not-available");

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
                        canvas.removeClasses("lto-active");
                        this.activateScanner(wrapper);
                    });
            })
            .catch(error => {
                console.error(error);
                video.classList.remove("lto-active");
                canvas.removeClasses("lto-active");
                const errorWrapper = wrapper.find(".lto-error");
                errorWrapper.setStyle({display: "block"});
                wrapper.addClasses("lto-not-available");
            });
    }


    public static disableResetButton(wrapper: INode) {
        const resetButton = wrapper.find(".lto-reset-button");
        if (resetButton) {
            resetButton.removeClasses("lto-active");
            resetButton.addClasses("lto-disabled");
        }
    }

    public activateResetButton(wrapper: INode) {
        const resetButton = wrapper.find(".lto-reset-button");
        const successLabel = wrapper.find(".lto-read-success");
        if (!resetButton) {
            return
        }
        resetButton.removeClasses("lto-disabled");
        resetButton.addClasses("lto-active");
        resetButton.onClick(() => {
            wrapper.removeClasses("lto-success");
            wrapper.removeAttributes("value");
            successLabel.innerText("");
            CodeReader.disableResetButton(wrapper);
            this.initCamera(wrapper);
        });
    }

    public publishResult(wrapper: INode, result: Promise<Result> | null) {
        if (result !== null) {
            result.then(result => {
                const text = result.getText();
                const successLabel = wrapper.find(".lto-read-success");
                if (successLabel) {
                    successLabel.innerText(text);
                }
                wrapper.addClasses("lto-success");
                wrapper.addAttributes({value: text});
                this.activateResetButton(wrapper);
                this.stopCamera(wrapper);
            })
        } else {
            console.error("Failed to publish result");
        }
    }

    private activateScanner(wrapper: INode) {
        const video = wrapper.find("video");
        const scanner = new Scanner();
        scanner.setDevice(video.unwrap() as HTMLVideoElement);
        wrapper.removeClasses("lto-success");

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

    private stopCamera(wrapper: INode) {
        const video = wrapper.find("video");
        video.removeClasses("lto-active");
        const canvas = wrapper.find("canvas");
        canvas.addClasses("lto-active");
        drawCanvas(canvas.unwrap() as HTMLCanvasElement, video.unwrap() as HTMLVideoElement, this.mediaStream||new MediaStream(), this.maxCanvasSize);
        this.mediaStream!.getTracks().forEach(track => track.stop());
    }

}

Renderables.register("codereader", CodeReader);
