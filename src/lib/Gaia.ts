import {IListener} from './api/IListener';
import {IRenderer} from './api/IRenderer';
import {MqttConnection} from './connection/MqttConnection';
import {DefaultListener} from './listener/DefaultListener';

export class Gaia {

    private readonly emitter: IListener;
    private readonly renderer: IRenderer;

    constructor(renderer: IRenderer, emitter?: IListener) {
        this.emitter = new DefaultListener(emitter || null);
        this.renderer = renderer;
    }

    public connect(url: string, identity: string): Promise<MqttConnection> {
        return new Promise((resolve) => resolve(new MqttConnection(url, identity, this.renderer, this.emitter)));
    }

}
