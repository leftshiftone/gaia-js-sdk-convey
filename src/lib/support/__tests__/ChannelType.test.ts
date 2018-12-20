import {ChannelType} from "../ChannelType";

describe("ChannelType test", () => {
    test("match", () => {
        [
            ["/GAIA/RAIN/identity_id/1234/context/in", ChannelType.CONTEXT],
            ["/GAIA/RAIN/identity_id/1234/text/in", ChannelType.TEXT],
            ["/GAIA/RAIN/identity_id/1234/audio/in", ChannelType.AUDIO],
            ["/GAIA/RAIN/identity_id/1234/notification/in", ChannelType.NOTIFICATION],
            ["/GAIA/RAIN/identity_id/1234/test/in", null],
            ["/GAIA//identity_id/1234/test/in", null],
            ["/GAIA/RAIN/identity_id/1234/in", null],
            ["/GAIA/RAIN/identity_id/123 4/notification/in",null],
            ["context", null]
        ]
            .forEach(topic => expect(ChannelType.match(topic[0]!)).toBe(topic[1]))
    })
});
