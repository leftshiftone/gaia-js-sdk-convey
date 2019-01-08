import {IEmitter} from './api/IEmitter';
import {IRenderer} from './api/IRenderer';
import {MqttConnection} from './connection/MqttConnection';
import {DefaultEmitter} from './emitter/DefaultEmitter';

export class Gaia {

    private readonly emitter: IEmitter;
    private readonly renderer: IRenderer;

    constructor(renderer: IRenderer, emitter?: IEmitter) {
        this.emitter = new DefaultEmitter(emitter || null);
        this.renderer = renderer;
    }

    public connect(url: string, identity: string): Promise<MqttConnection> {
        return new Promise((resolve) => resolve(new MqttConnection(url, identity, this.renderer, this.emitter)));
    }

}
