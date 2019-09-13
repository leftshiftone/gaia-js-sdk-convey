let barcodeReader: any = null;
let qrCodeReader: any = null;

if (typeof document !== "undefined" && typeof window !== "undefined") {
    barcodeReader = require("@zxing/library/esm5/browser/BrowserBarcodeReader");
    qrCodeReader = require("@zxing/library/esm5/browser/BrowserQRCodeReader");
}

/**
 * The scanner class provides functionality to scan
 * codes.
 *
 * @see {@link CodeReader}
 */
export class Scanner {

    /**
     * Scan a QR code using the BrowserQRCodeReader
     * library.
     *
     * @param deviceId
     */
    public static scanQRCodeFromDevice(deviceId: string) {
        if (qrCodeReader !== null) {
            const {BrowserQRCodeReader} = qrCodeReader;
            if (deviceId) {
                const codeReader = new BrowserQRCodeReader();
                return codeReader.decodeFromInputVideoDevice(deviceId)
            }
            console.error("Set video device before calling this function");
        }
        return null
    }

    /**
     * Scan a barcode using the BrowserBarcodeReader
     * library.
     *
     * @param deviceId
     */
    public static scanBarCodeFromDevice(deviceId: string) {
        if (barcodeReader !== null) {
            const {BrowserBarcodeReader} = barcodeReader;
            if (deviceId) {
                const codeReader = new BrowserBarcodeReader();
                return codeReader.decodeFromInputVideoDevice(deviceId)
            }
            console.error("Set video device before calling this function");
        }
        return null
    }

}

