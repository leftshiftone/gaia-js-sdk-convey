/**
 * @author benjamin.krenn@leftshift.one - 3/14/19.
 * @since 0.1.0
 */
export class Base64ToArrayBufferConverter {
    /**
     * Converts a base64 to an ArrayBuffer object
     * @returns {ArrayBufferLike}
     */
    public static base64ToArrayBuffer(base64: string) : ArrayBufferLike {
        const binaryString =  window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++)        {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
