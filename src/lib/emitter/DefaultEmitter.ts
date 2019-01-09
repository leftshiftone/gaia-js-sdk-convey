import {IEmitter} from '../api/IEmitter';

/**
 * Default IEmitter implementation.
 */
export class DefaultEmitter implements IEmitter {

    private emitter: IEmitter | null;

    constructor(emitter: IEmitter | null) {
        this.emitter = emitter;
    }

    /**
     * {@inheritDoc}
     */
    public onConnected(): void {
        if (this.emitter && this.emitter.onConnected) {
            this.emitter.onConnected();
        }
    }

    /**
     * {@inheritDoc}
     */
    public onDisconnected(): void {
        if (this.emitter && this.emitter.onDisconnected) {
            this.emitter.onDisconnected();
        }
    }

    /**
     * {@inheritDoc}
     */
    public onError(error: string): void {
        if (this.emitter && this.emitter.onError) {
            this.emitter.onError(error);
        }
    }

    /**
     * {@inheritDoc}
     */
    public onMessage(data: any): void {
        if (this.emitter && this.emitter.onMessage) {
            this.emitter.onMessage(data);
        }
    }

}
