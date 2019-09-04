import {Italic} from "../index";
import {ContentCentricRenderer} from "../../../renderer/ContentCentricRenderer";

describe("ItalicTest", () => {
    it("beforeAll", () => {
        document.body.innerHTML = `<div class="lto-gaia lto-content lto-suggest"/>`
    });

    it("render", () => {
        const italic = new Italic({text: "text", type: "italic"});
        const element = italic.render(new ContentCentricRenderer(), true);
        expect(element.tagName).toBe("I");
        expect(element.innerText).toBe("text");
    })
});
