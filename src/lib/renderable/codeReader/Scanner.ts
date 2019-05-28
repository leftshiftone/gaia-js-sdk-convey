import {BrowserBarcodeReader, BrowserQRCodeReader} from "@zxing/library";

export class Scanner {

    // @ts-ignore
    private deviceId: string;

    constructor(deviceId: string | HTMLVideoElement) {
        this.setDeviceId(deviceId);
    }

    public setDeviceId(a: string | HTMLVideoElement) {
        if(a instanceof HTMLVideoElement) {
            // @ts-ignore
            a.srcObject!.getVideoTracks().forEach(e => {
                this.deviceId = e.getCapabilities().deviceId
            });
            return this;
        } else {
            this.deviceId = a;
        }
        return this
    }

    public scanQRCode() {
        const codeReader = new BrowserQRCodeReader();
        return codeReader.decodeFromInputVideoDevice(this.deviceId)
    }

    public scanBarCode() {
        const codeReader = new BrowserBarcodeReader();
        return codeReader.decodeFromInputVideoDevice(this.deviceId)
    }

}

