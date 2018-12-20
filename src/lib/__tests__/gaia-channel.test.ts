import {GaiaChannel} from "../gaia-channel";

let channel: any;

beforeAll(() => {
    channel = new GaiaChannel(document.createElement('div').setAttribute("id", "container"), "1337",{});
    channel.connect("ws://localhost:61616");
});

describe("gaia-channel test", () => {
    test("identityId is correct", () => { expect(channel.idenityId).toBe("1337") });

    test("no callbacks in map", () => {
        channel.subscribe(channel.inboundTextDestination);
        expect(channel.callbacks.size).toBe(0);
        channel.unsubscribe(channel.inboundTextDestination);
    });

    test("on callback in map", () => {
        channel.subscribe(channel.inboundContextDestination,() => {});
        expect(channel.callbacks.size).toBe(1);
        channel.unsubscribe(channel.inboundContextDestination);
    });
});
