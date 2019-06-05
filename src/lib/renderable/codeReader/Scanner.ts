let barcodeReader: any = null;
let qrCodeReader: any = null;

if (typeof document !== "undefined" && typeof window !== "undefined") {
    barcodeReader = require("@zxing/library/esm5/browser/BrowserBarcodeReader");
    qrCodeReader = require("@zxing/library/esm5/browser/BrowserQRCodeReader");
}

export class Scanner {

    private deviceId: string | undefined = "";

    public setDevice(htmlVideoElement: HTMLVideoElement) {
        (htmlVideoElement.srcObject as MediaStream).getVideoTracks().forEach(track => {
            this.deviceId = track.getCapabilities().deviceId
        });
        return this;
    }

    public scanQRCode() {
        if (qrCodeReader !== null) {
            const {BrowserQRCodeReader} = qrCodeReader;
            if (this.deviceId) {
                const codeReader = new BrowserQRCodeReader();
                return codeReader.decodeFromInputVideoDevice(this.deviceId)
            }
            console.error("Set video device before calling this function");
        }
        return null
    }

    public scanBarCode() {
        if (barcodeReader !== null) {
            const {BrowserBarcodeReader} = barcodeReader;
            if (this.deviceId) {
                const codeReader = new BrowserBarcodeReader();
                return codeReader.decodeFromInputVideoDevice(this.deviceId)
            }
            console.error("Set video device before calling this function");
        }
        return null
    }

}

