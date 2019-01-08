export interface IEmitter {

    onConnected(): void;

    onDisconnected(): void;

    onError(error: string): void;

    onMessage(data: any): void;

}
