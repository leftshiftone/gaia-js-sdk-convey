export interface IPacket {
    cmd: "connect" | "publish" | "connack" | "subscribe" | "suback" | "unsubscribe" | "unsuback" | "puback" | "pubcomp" | "pubrel" | "pingreq" | "pingresp" | "disconnect" | "pubrec"
    payload?: string
    topic?: string
}
