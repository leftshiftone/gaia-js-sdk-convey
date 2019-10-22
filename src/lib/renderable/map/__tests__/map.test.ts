
import {GoogleMap} from "../google";

describe("MapTest", () => {

    let googleMap : GoogleMap;

    it("beforeAll", () => {
        googleMap = new GoogleMap({required:true, centerLng:1, centerLat:1, name:"map", type:"map"})
    });

    it("google map render", () => {
        const element = googleMap.render();
        expect(element.classList.contains("lto-map")).toBeTruthy();
        expect(element.dataset.required).toBe("true");
        expect(element.tagName).toBe("DIV");
        expect(element.getAttribute("name")).toBe("map");
        expect(element.getAttribute("data-value")).toBeNull();
    });
});
