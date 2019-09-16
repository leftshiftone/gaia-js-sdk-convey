import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from '../Renderables';
import node, {INode} from "../../support/node";
import {Scanner} from "./Scanner";
import Result from "@zxing/library/esm5/core/Result";
import {getUserVideoMedia} from "../../support/Navigator";
import {drawCanvas} from "../../support/Canvas";

/**
 * Implementation of the 'codeReader' markup element.
 * Creates an HTML canvas element that allows the scanning of
 * media elements using a media stream e.g. QR codes @see {@link Scanner}
 * The class lto-code-reader is added to allow CSS
 * manipulations.
 *
 * @see {@link IRenderable}
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
        if (userMedia == null)
            return;

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
        }).catch(error => {
            console.error(error);
            video.classList.remove("lto-active");
            canvas.removeClasses("lto-active");
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

        if (!resetButton)
            return;

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
            }).catch(reason => console.error(reason))
        } else {
            console.error("Result is null");
        }
    }

    private activateScanner(wrapper: INode) {
        const video = wrapper.find("video");
        CodeReader.getDeviceId(video).then(deviceId => {
            wrapper.removeClasses("lto-success");
            switch (this.spec.format) {
                case "qr":
                    this.publishResult(wrapper, Scanner.scanQRCodeFromDevice(deviceId));
                    break;
                case "bar":
                    this.publishResult(wrapper, Scanner.scanBarCodeFromDevice(deviceId));
                    break;
                default:
                    console.error("Format: " + this.spec.format + " is not supported")
            }
        }).catch(reason => console.error(reason))

    }

    private stopCamera(wrapper: INode) {
        const video = wrapper.find("video");
        video.removeClasses("lto-active");
        const canvas = wrapper.find("canvas");
        canvas.addClasses("lto-active");
        drawCanvas(canvas.unwrap() as HTMLCanvasElement, video.unwrap() as HTMLVideoElement, this.mediaStream || new MediaStream(), this.maxCanvasSize);
        this.mediaStream!.getTracks().forEach(track => track.stop());
    }

    public static getDeviceId(node: INode) {
        const htmlVideoElement = node.unwrap() as HTMLVideoElement;
        return new Promise<string>(resolve => {
            (htmlVideoElement.srcObject as MediaStream).getVideoTracks().forEach(track =>
                navigator.mediaDevices.enumerateDevices().then(value =>
                    value.forEach(e => {
                        if (e.label === track.label)
                            resolve(e.deviceId);
                    })
                )
            );
        });
    }

}

Renderables.register("codereader", CodeReader);
