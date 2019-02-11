import {ChannelType} from "../ChannelType";

describe("ChannelType test", () => {
    test("match", () => {
        [
            ["/GAIA/RAIN/identity_id/1234/context/in", ChannelType.CONTEXT],
            ["/GAIA/RAIN/identity_id/1234/text/in", ChannelType.TEXT],
            ["/GAIA/RAIN/identity_id/1234/audio/in", ChannelType.AUDIO],
            ["/GAIA/RAIN/identity_id/1234/notification/in", ChannelType.NOTIFICATION]
        ]
            .forEach(topic => expect(ChannelType.match(topic[0]!)).toBe(topic[1]));
    });
});
