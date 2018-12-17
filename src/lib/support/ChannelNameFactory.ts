import {ChannelType} from "./ChannelType";

export class ChannelNameFactory {

    static readonly GAIA_ROOT_TOPIC = "GAIA";
    static readonly GAIA_RAIN_TOPIC = `${ChannelNameFactory.GAIA_ROOT_TOPIC}/RAIN`;

    static readonly GAIA_SYSTEM_TOPIC = "system";

    static readonly GAIA_INBOUND_TOPIC = "in";
    static readonly GAIA_OUTBOUND_TOPIC = "out";

    public static systemChannelNameOut(channelType: ChannelType): string {
        return `${ChannelNameFactory.GAIA_RAIN_TOPIC}/${ChannelNameFactory.GAIA_SYSTEM_TOPIC}/${channelType.toString().toLowerCase()}/${ChannelNameFactory.GAIA_INBOUND_TOPIC}`
    }

    public static clientChannelNameIn(clientId: String, identityId: String, channelType: ChannelType): string {
        return `${ChannelNameFactory.GAIA_RAIN_TOPIC}/${clientId}/${identityId}/${channelType.toLowerCase()}/${ChannelNameFactory.GAIA_INBOUND_TOPIC}`
    }

    public static clientChannelNameOut(clientId: String, identityId: String, channelType: ChannelType): string {
        return `${ChannelNameFactory.GAIA_RAIN_TOPIC}/${clientId}/${identityId}/${channelType.toLowerCase()}/${ChannelNameFactory.GAIA_OUTBOUND_TOPIC}`
    }
}
