export interface Emitter {

    onConnected?(): void;

    onDisconnected?(): void;

    onError?(error: string): void;

    onMessage?(data: any): void;

    onPreRender?(message: any, outgoing: boolean): Promise<any>;

    onPostRender?(message: any, outgoing: boolean): Promise<any>;

}

export class EmitterAdapter implements Emitter {

    private emitter: Emitter | null;

    constructor(emitter: Emitter | null) {
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

    onPostRender(message: any, outgoing: boolean): Promise<any> {
        if (this.emitter && this.emitter.onPostRender) {
            return this.emitter.onPostRender(message, outgoing);
        }
        return Promise.resolve(message);
    }

    onPreRender(message: any, outgoing: boolean): Promise<any> {
        if (this.emitter && this.emitter.onPreRender) {
            return this.emitter.onPreRender(message, outgoing);
        }
        return Promise.resolve(message);
    }

}
