import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'upload' markup element.
 */
export class Upload implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';

        const dropArea = document.createElement("div");
        const upload = document.createElement("input");
        const uploadLabel = document.createElement("label");
        const textSpan = document.createElement("span");
        const fileSpan = document.createElement("span");
        const errorSpan = document.createElement("span");

        textSpan.innerText = this.spec.text || "";
        errorSpan.classList.add("lto-upload-error-label");
        textSpan.classList.add("lto-upload-text-label");
        fileSpan.classList.add("lto-upload-file-label");
        uploadLabel.classList.add("lto-upload", "lto-" + position);
        upload.type = "file";
        upload.accept = this.spec.accept || "";
        dropArea.classList.add("lto-drop-area", "lto-" + position);
        dropArea.setAttribute("name", this.spec.name || "");

        if (isNested) {
            uploadLabel.classList.add("lto-nested");
            dropArea.classList.add("lto-nested");
        }

        if (this.spec.class !== undefined)
            this.spec.class.split(" ").forEach(e => {
                uploadLabel.classList.add(e);
                dropArea.classList.add(e);
            });

        dropArea.ondragover = (ev) => ev.preventDefault();

        dropArea.ondrop = (ev) => {
            ev.preventDefault();

            const file = ev.dataTransfer.items ? ev.dataTransfer.items[0].getAsFile() : ev.dataTransfer.files[0];

            if (file) {
                const fileExtension = file.name.split(".").pop();
                let extensionAllowed = false;
                if(this.spec.accept !== undefined) {
                    const allowedExtensions = this.spec.accept!.replace(/\s/g, '').split(",");
                    allowedExtensions.forEach(e => {
                        if (e === "." + fileExtension) extensionAllowed = true
                    });
                } else extensionAllowed = true;

                if (extensionAllowed && file.size <= this.spec.maxSize! * 1024 * 1024) {
                    fileSpan.innerText = file.name;
                    errorSpan.innerText = "";
                    this.getBase64(file)
                        .then(data => dropArea.setAttribute("value", data.toString()))
                        .catch(reason => console.error("ERROR: " + reason));
                } else {
                    errorSpan.innerText = "file not valid";
                    fileSpan.innerText = "";
                }
            }
        };

        upload.onchange = () => {
            if (upload.files)
                if (upload.files[0].size <= this.spec.maxSize! * 1024 * 1024) {
                    fileSpan.innerText = upload.files[0].name;
                    errorSpan.innerText = "";
                    this.getBase64(upload.files[0])
                        .then(data => dropArea.setAttribute("value", data.toString()))
                        .catch(reason => console.error("ERROR: " + reason));
                } else {
                    errorSpan.innerText = "file not valid";
                    fileSpan.innerText = "";
                }
        };

        uploadLabel.appendChild(upload);
        uploadLabel.appendChild(textSpan);
        dropArea.appendChild(uploadLabel);
        dropArea.appendChild(fileSpan);
        dropArea.appendChild(errorSpan);
        dropArea.appendChild(errorSpan);

        return dropArea;
    }

    public getBase64(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result!);
            reader.onerror = error => reject(error);
        });
    }
}

Renderables.register("upload", Upload);
