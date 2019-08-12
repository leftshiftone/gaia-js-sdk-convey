import {IPacket} from "./IPacket";

export interface IListener {

    onConnected(): void;

    onConnectionLost(): void;

    onPacketSend(packet: IPacket): void;

    onDisconnected(): void;

    onError(error: string): void;

    onMessage(data: any): void;

}
