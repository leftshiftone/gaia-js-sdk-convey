import {BrowserBarcodeReader, BrowserQRCodeReader} from "@zxing/library";

export class Scanner {

    private deviceId: string | undefined = "";

    public setDevice(htmlVideoElement: HTMLVideoElement) {
        (htmlVideoElement.srcObject as MediaStream).getVideoTracks().forEach(track => {
            this.deviceId = track.getCapabilities().deviceId
        });
        return this;
    }

    public scanQRCode() {
        if(this.deviceId) {
            const codeReader = new BrowserQRCodeReader();
            return codeReader.decodeFromInputVideoDevice(this.deviceId)
        }
        console.error("Set video device before calling this function");
        return null
    }

    public scanBarCode() {
        if(this.deviceId) {
            const codeReader = new BrowserBarcodeReader();
            return codeReader.decodeFromInputVideoDevice(this.deviceId)
        }
        console.error("Set video device before calling this function");
        return null
    }

}

