import {Base64ToArrayBufferConverter} from "../Base64ToArrayBufferConverter";

describe("Base64ToArrayBufferConverterTest", () => {
    test("", () => {
        const base64String = window.btoa("Some String!1!");
        const result = Base64ToArrayBufferConverter.base64ToArrayBuffer(base64String);
        // @ts-ignore
        expect(String.fromCharCode.apply(String, new Uint8Array(result))).toBe("Some String!1!");
    });
});
