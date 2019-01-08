export enum ChannelType {
    NOTIFICATION = "NOTIFICATION",
    CONTEXT = "CONTEXT",
    TEXT = "TEXT",
    AUDIO = "AUDIO"
}

export namespace ChannelType {
    export function match(topic: string) {
        const match = topic.match(/GAIA\/RAIN\/[\w-]+\/[\w-]+\/(\w+)\/in/);
        if (match !== null) {
            const channelType = ChannelType[match![1].toUpperCase()];
            if (channelType !== undefined) {
                return channelType;
            }
        }
        throw new Error("no channel " + topic + " found");
    }
}
