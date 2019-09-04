import {Items} from "../index";
import {ClassicRenderer} from "../../../renderer/ClassicRenderer";

describe("ItemsTest", () => {
    it("beforeAll", () => {
        document.body.innerHTML = `<div class="lto-gaia lto-content lto-suggest"/>`
    });

    it("render ordered list", () => {
        const items = new Items({ordered: true, type: "items"});
        const element = items.render(new ClassicRenderer(), true);
        expect(element.tagName).toBe("OL")
    });

    it("render unordered list", () => {
        const items = new Items({ordered: false, type: "items"});
        const element = items.render(new ClassicRenderer(), true);
        expect(element.tagName).toBe("UL")
    })
});
