import {Gaia} from "../Gaia";
import {ClassicRenderer} from '../renderer/ClassicRenderer';

let channel: any;

beforeAll(() => {
    const renderer = new ClassicRenderer(document.createElement('div'));

    channel = new Gaia(renderer);
    channel.connect("ws://localhost:61616", "1337");
});

describe("gaia-channel test", () => {
    test("identityId is correct", () => { expect(channel.idenityId).toBe("1337"); });

    test("no callbacks in map", () => {
        channel.subscribe(channel.inboundTextDestination);
        expect(channel.callbacks.size).toBe(0);
        channel.unsubscribe(channel.inboundTextDestination);
    });

    test("on callback in map", () => {
        channel.subscribe(channel.inboundContextDestination, () => {});
        expect(channel.callbacks.size).toBe(1);
        channel.unsubscribe(channel.inboundContextDestination);
    });
});
