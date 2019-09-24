/**
 * Supported G.A.I.A. channel types:
 *  TEXT: receives the message which will be displayed
 *  LOG: receives different system logs (error & info
 *  CONTEXT: receives the full context every time
 *  NOTIFICATION: receives some custom specified notification
 */
export enum ChannelType {
    NOTIFICATION = "NOTIFICATION",
    CONTEXT = "CONTEXT",
    TEXT = "TEXT",
    AUDIO = "AUDIO",
    LOG = "LOG"
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
