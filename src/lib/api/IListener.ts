import {Packet} from 'mqtt'

export interface IListener {

    onConnected(): void;

    onConnectionLost(): void;

    onPacketSend(packet: Packet): void;

    onDisconnected(): void;

    onError(error: string): void;

    onMessage(data: any): void;

}
