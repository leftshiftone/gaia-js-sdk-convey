/**
 * This interface is used for MQTT packets
 *  cmd: the message type
 *  payload: the payload
 *  topic: the topic
 *
 * @see {@link IListener}
 */
export interface IPacket {
    cmd: "connect" | "publish" | "connack" | "subscribe" | "suback" | "unsubscribe" | "unsuback" | "puback" | "pubcomp" | "pubrel" | "pingreq" | "pingresp" | "disconnect" | "pubrec"
    payload?: string
    topic?: string
}
