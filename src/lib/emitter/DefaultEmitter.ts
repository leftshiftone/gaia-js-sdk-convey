import {IEmitter} from '../api/IEmitter';

export class DefaultEmitter implements IEmitter {

    private emitter: IEmitter | null;

    constructor(emitter: IEmitter | null) {
        this.emitter = emitter;
    }

    onConnected(): void {
        if (this.emitter && this.emitter.onConnected) {
            this.emitter.onConnected();
        }
    }

    onDisconnected(): void {
        if (this.emitter && this.emitter.onDisconnected) {
            this.emitter.onDisconnected();
        }
    }

    onError(error: string): void {
        if (this.emitter && this.emitter.onError) {
            this.emitter.onError(error);
        }
    }

    onMessage(data: any): void {
        if (this.emitter && this.emitter.onMessage) {
            this.emitter.onMessage(data);
        }
    }

}
