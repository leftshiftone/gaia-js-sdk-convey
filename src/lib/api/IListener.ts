export interface IListener {

    onConnected(): void;

    onConnectionLost(): void;

    onDisconnected(): void;

    onError(error: string): void;

    onMessage(data: any): void;

}
