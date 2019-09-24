import {IPacket} from "./IPacket";

/**
 * Classes which implement this interface can implement the following event functions
 */
export interface IListener {

    /**
     * Is called when the client is connected to the server
     */
    onConnected(): void;

    /**
     * Is called when the client lost the connection
     */
    onConnectionLost(): void;

    /**
     * Is called when a packet will be sent
     *
     * @param packet the packet which will be sent
     */
    onPacketSend(packet: IPacket): void;

    /**
     * Is called when the client is disconnected
     */
    onDisconnected(): void;

    /**
     * Is called when an error occurred
     *
     * @param error the error message
     */
    onError(error: string): void;

    /**
     * Is called when the client receives a message from the server
     *
     * @param data the message data
     */
    onMessage(data: any): void;

}
