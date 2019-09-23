import {IRenderable, IRenderer, ISpecification} from '../../api';
import Renderables from '../Renderables';
import {getBase64FromFile, getFileExtensionFromFile, isImageFile} from "../../support/Files";
import {InputContainer} from "../../support/InputContainer";

/**
 * Implementation of the 'upload' markup element.
 * Multiple HTML elements are used to create an upload drop area.
 * For CSS manipulations the following classes are added:
 *  lto-upload-error-label: text for error messages
 *  lto-upload-file-label: upload file text
 *  lto-upload-file-extension-label: file extension text label
 *  lto-upload-size-label: file size text label
 *  lto-upload-text-label: upload file text label
 *  lto-upload: general CSS upload class
 *
 * @see {@link IRenderable}
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
        InputContainer.setRequiredAttribute(this.dropArea, this.spec.required);
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
            if (!upload.files || !upload.files[0]) {
                return
            }

            const file: File = upload.files[0];

            if (!this.validateFile(file.size, getFileExtensionFromFile(file)))
                return;

            this.setFileNameToSpan(file.name).setErrorSpanTo("");

            if (!this.spec.maxCompressSize || !isImageFile(getFileExtensionFromFile(file))) {
                this.doValidateAndGetBase64(file);
            } else if (this.spec.maxCompressSize && isImageFile(getFileExtensionFromFile(file))) {
                this.doValidateCompressAndGetBase64(file);
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
        getBase64FromFile(file)
            .then(data => this.setDataToValue(data, file))
            .then(() => this.setSuccessClass())
            .catch(reason => {
                console.error(`Unable to get file: ${reason}`);
                this.removeSuccessClass();
            });
    }

    public doValidateCompressAndGetBase64(file: File) {
        this.compressImage(file)
            .then((compressedFile: File) => {
                console.debug(`Compressed object is instanceof Blob: ${compressedFile instanceof Blob}`);
                console.info(`Compressed to size ${compressedFile.size / 1024 / 1024} MB`);
                return getBase64FromFile(compressedFile);
            })
            .then(base64Data => this.setDataToValue(base64Data, file))
            .then(() => this.setSuccessClass())
            .catch(reason => console.error(`Unable to compress file: ${reason}`));
    }

    public setSuccessClass() {
        if (!this.dropArea.classList.contains("lto-success")) {
            this.dropArea.classList.add("lto-success");
        }
    }

    public removeSuccessClass() {
        this.dropArea.classList.remove("lto-success");
    }

    public setDataToValue(data: string, file: File) {
        this.dropArea.setAttribute("data-value", JSON.stringify({
            data: data.split(",")[1],
            fileExtension: getFileExtensionFromFile(file),
            fileName: file.name,
            mimeType: file.type
        }));
    }

    private async compressImage(file: File): Promise<File> {
        console.info(`Attempt to comress file with max. compress size ${this.spec.maxCompressSize}`);

        let imageCompression = typeof window !== "undefined" ? require("browser-image-compression/dist/browser-image-compression") : null;
        if (!imageCompression) {
            console.error("Image compression is not available; returning uncompressed file");
            return file;
        }
        const options = {
            maxSizeMB: this.spec.maxCompressSize,
            useWebWorker: false,
            maxWidthOrHeight: 974
        };
        return imageCompression.default(file, options);
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
