import {Video} from "../index";

describe("VideoTest", () => {
    test("render", () => {
        const video = new Video({src: "src", type: "video"});
        // @ts-ignore
        const element = video.render(undefined, true) as HTMLVideoElement;
        expect(element.classList.contains("lto-video")).toBeTruthy();
        expect(element.classList.contains("lto-nested")).toBeTruthy();
        expect(element.src).toBe("http://localhost/src");
        expect(element.tagName).toBe("VIDEO");
        expect(element.controls).toBeTruthy();
    })
});
