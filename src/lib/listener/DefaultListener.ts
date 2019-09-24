import {IPacket, IListener} from '../api';

/**
 * @inheritDoc
 *
 * Default IListener implementation.
 */
export class DefaultListener implements IListener {

    private emitter: IListener | null;

    constructor(emitter: IListener | null) {
        this.emitter = emitter;
    }

    /**
     * @inheritDoc
     */
    public onConnected(): void {
        if (this.emitter && this.emitter.onConnected) {
            this.emitter.onConnected();
        }
    }

    /**
     * @inheritDoc
     */
    public onConnectionLost(): void {
        if (this.emitter && this.emitter.onConnectionLost) {
            this.emitter.onConnectionLost();
        }
    }

    /**
     * @inheritDoc
     */
    public onDisconnected(): void {
        if (this.emitter && this.emitter.onDisconnected) {
            this.emitter.onDisconnected();
        }
    }

    /**
     * @inheritDoc
     */
    public onError(error: string): void {
        if (this.emitter && this.emitter.onError) {
            this.emitter.onError(error);
        }
    }

    /**
     * @inheritDoc
     */
    public onMessage(data: any): void {
        if (this.emitter && this.emitter.onMessage) {
            this.emitter.onMessage(data);
        }
    }

    /**
     * @inheritDoc
     */
    public onPacketSend(packet: IPacket): void {
        if (this.emitter && this.emitter.onPacketSend) {
            this.emitter.onPacketSend(packet);
        }
    }

}
