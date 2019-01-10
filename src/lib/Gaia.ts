import {IListener} from './api/IListener';
import {IRenderer} from './api/IRenderer';
import {MqttConnection} from './connection/MqttConnection';
import {DefaultListener} from './listener/DefaultListener';

export class Gaia {

    private readonly listener: IListener;
    private readonly renderer: IRenderer;

    constructor(renderer: IRenderer, emitter?: IListener) {
        this.listener = new DefaultListener(emitter || null);
        this.renderer = renderer;
    }

    public connect(url: string, identity: string): Promise<MqttConnection> {
        return new Promise((resolve) => resolve(new MqttConnection(url, identity, this.renderer, this.listener)));
    }

}
