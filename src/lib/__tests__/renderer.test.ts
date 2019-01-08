import {ClassicRenderer} from "../renderer/ClassicRenderer";

let renderer: any;

beforeAll(() => {
    renderer = new ClassicRenderer(document.createElement("div"));
});

describe("renderer test", () => {
    test("getElement", () => {
        [
            [{"text": "Alors, wie kann ich Ihnen dienen?", "type": "text"},
                JSON.stringify({"name": "text", "position": undefined, "text": "Alors, wie kann ich Ihnen dienen?"})],
            [{"name": "result", "text": "Wein empfehlen", "type": "button", "value": "eyJwYXlsb2FkIjoicmVjb21tZW5kX3dpbmUifQ=="},
                JSON.stringify({"name": "button", "text": "Wein empfehlen", "buttonName": "result", "value": "eyJwYXlsb2FkIjoicmVjb21tZW5kX3dpbmUifQ=="})],
            [{"type": "break"},
                JSON.stringify({"name": "break"})]
        ]
            .forEach(message =>
                expect(JSON.stringify(renderer.getElement((message[0])))).toBe(message[1])
            )
    })
});
