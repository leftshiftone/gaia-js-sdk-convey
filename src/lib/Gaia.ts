import {IListener, IRenderer} from './api';
import {MqttConnection} from './connection/MqttConnection';
import {DefaultListener} from './listener/DefaultListener';

export class Gaia {

    private readonly listener: IListener;
    private readonly renderer: IRenderer;

    constructor(renderer: IRenderer, listener?: IListener) {
        this.listener = new DefaultListener(listener || null);
        this.renderer = renderer;
    }

    /**
     * Connect the client to the G.A.I.A ecosystem.
     *
     * @param url the URL to G.A.I.A.
     * @param identity the ID of the identity
     * @param username
     * @param password
     */
    public connect(url: string, identity: string, username?: string | null, password?: string | null): Promise<MqttConnection> {
        return new Promise((resolve) => resolve(new MqttConnection(url, identity, this.renderer, this.listener, username, password)));
    }
}
