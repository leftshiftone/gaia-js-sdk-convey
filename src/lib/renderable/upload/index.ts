import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {getBase64FromFile, getFileExtensionFromFile} from "../../support/Files";

let imageCompression: any = null;

if (typeof window !== "undefined") {
    imageCompression = require("browser-image-compression/dist/browser-image-compression");
}

/**
 * Implementation of the 'upload' markup element.
 */
export class Upload implements IRenderable {

    private readonly spec: ISpecification;
    private errorSpan = document.createElement("span");
    private fileSpan = document.createElement("span");
    private dropArea = document.createElement("div");

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';

        const upload = document.createElement("input");
        const uploadLabel = document.createElement("label");
        const textSpan = document.createElement("span");
        const extensionSpan = document.createElement("span");
        const sizeSpan = document.createElement("span");

        this.errorSpan.className = "lto-upload-error-label";
        this.fileSpan.className = "lto-upload-file-label";
        extensionSpan.className = "lto-upload-extension-label";
        sizeSpan.className = "lto-upload-size-label";
        textSpan.className = "lto-upload-text-label";
        uploadLabel.className = "lto-upload";
        textSpan.innerText = this.spec.text || "";
        extensionSpan.innerText = this.spec.accept || "";
        sizeSpan.innerText = this.spec.maxSize!.toString() || "";
        upload.type = "file";

        if (this.spec.accept) {
            const acceptArray = this.spec.accept.replace(/\s/g, '').split(",");
            upload.accept = "." + acceptArray.join(",.");
        }

        this.dropArea.classList.add("lto-drop-area", "lto-" + position);
        this.dropArea.setAttribute("name", this.spec.name || "");

        if (isNested) {
            uploadLabel.classList.add("lto-nested");
            this.dropArea.classList.add("lto-nested");
        }

        if (this.spec.id !== undefined) {
            uploadLabel.id = this.spec.id;
        }
        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => {
                uploadLabel.classList.add(e);
                this.dropArea.classList.add(e);
            });

        this.dropArea.ondragover = (ev) => ev.preventDefault();

        this.dropArea.ondrop = (ev) => {
            ev.preventDefault();
            let file = null;
            if (ev.dataTransfer) {
                file = ev.dataTransfer.items ? ev.dataTransfer.items[0].getAsFile() : ev.dataTransfer.files[0];
            }

            if (file !== null)
                this.doValidateAndGetBase64(file);
        };

        upload.onchange = () => {
            if (upload.files && upload.files[0] && !this.spec.maxCompressSize) {
                this.doValidateAndGetBase64(upload.files[0]);
            } else if (upload.files && upload.files[0] && this.spec.maxCompressSize){
                this.doValidateCompressAndGetBase64(upload.files[0]);
            }
        };

        uploadLabel.appendChild(upload);
        uploadLabel.appendChild(textSpan);
        this.dropArea.appendChild(uploadLabel);
        this.dropArea.appendChild(extensionSpan);
        this.dropArea.appendChild(sizeSpan);
        this.dropArea.appendChild(this.fileSpan);
        this.dropArea.appendChild(this.errorSpan);

        return this.dropArea;
    }

    public doValidateAndGetBase64(file: File) {
        if (!this.validateFile(file.size, getFileExtensionFromFile(file)))
            return;

        this.setFileNameToSpan(file.name).setErrorSpanTo("");

        getBase64FromFile(file)
            .then(data => {
                this.dropArea.setAttribute("value", JSON.stringify({
                    data: data.toString().split(",")[1],
                    fileExtension: getFileExtensionFromFile(file),
                    fileName: file.name,
                    mimeType: file.type
                }))
            })
            .catch(reason => console.error("ERROR: " + reason));
    }

    public doValidateCompressAndGetBase64(file: File) {
        if (!this.validateFile(file.size, getFileExtensionFromFile(file)))
            return;

        this.setFileNameToSpan(file.name).setErrorSpanTo("");

        this.getCompressedImage(file)
            .then(compressedFile => getBase64FromFile(compressedFile))
            .then(data => {
                this.dropArea.setAttribute("value", JSON.stringify({
                    data: data.toString().split(",")[1],
                    fileExtension: getFileExtensionFromFile(file),
                    fileName: file.name,
                    mimeType: file.type
                }))
            })
            .catch(reason => console.error("ERROR: " + reason));
    }

    public async getCompressedImage(file: File) : Promise<File> {
        const options = {
            maxSizeMB: this.spec.maxCompressSize,
            useWebWorker: false,
            maxWidthOrHeight: 974
        }


        if (imageCompression) {
            const compressedFile = await imageCompression.default(file, options);
            console.debug('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.debug(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
            return compressedFile;
        }

        return file;
    }

    public setFileNameToSpan(name: string) {
        this.fileSpan.innerText = name;
        return this
    }

    public setErrorSpanTo(text: string) {
        this.errorSpan.innerText = text;
        return this
    }

    public validateFile(size: number, extension?: string): boolean {
        this.setErrorSpanTo("");
        this.errorSpan.classList.remove("lto-upload-extension-error", "lto-upload-size-error");

        let extensionAllowed = true;
        let sizeAllowed = true;

        if (extension && this.spec.accept) {
            const allowedExtensions = this.spec.accept.replace(/\s/g, '').split(",");
            extensionAllowed = allowedExtensions.find(e => e === `${extension}`) !== undefined;

            if (!extensionAllowed) {
                this.setFileNameToSpan("");
                this.errorSpan.classList.add("lto-upload-extension-error");
            }
        }

        if (size > this.spec.maxSize! * 1024 * 1024) {
            this.setFileNameToSpan("");
            this.errorSpan.classList.add("lto-upload-size-error");
            sizeAllowed = false;
        }

        return sizeAllowed && extensionAllowed
    }
}

Renderables.register("upload", Upload);
