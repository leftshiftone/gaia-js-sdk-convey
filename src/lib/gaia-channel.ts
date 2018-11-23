import { Emitter, EmitterAdapter } from './emitter';
import { Renderer } from './renderer';
import * as mqtt from 'mqtt';
import { Packet } from 'mqtt';

export class GaiaChannel {

    private emitter: EmitterAdapter;
    private renderer: Renderer;
    private mqttClient?: mqtt.MqttClient;
    private _clientId: string;
    private _identityId: string;
    private _userId: number;
    private _inboundDestination: string;
    private _outboundDestination: string;

    constructor(container: any, identityId: string, emitter: Emitter | null) {
        this.emitter = new EmitterAdapter(emitter);
        this.renderer = new Renderer(document.querySelector(container));
        this._clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        this._identityId = identityId;
        this._userId = Math.floor(Math.random() * 10000000001); //todo: make user id more persistent for an actual user (e.g. cookie, etc)
        this._inboundDestination = 'GAIA/RAIN/' + this._clientId + '/' + this._identityId + '/in';
        this._outboundDestination = 'GAIA/RAIN/' + this._clientId + '/' + this._identityId + '/out';
        this.onMessage = this.onMessage.bind(this);
    }

    public connect(url: any) {
        if (!this.mqttClient) {
            return new Promise((resolve) => {
                this.mqttClient = mqtt.connect(url, { clean: false, clientId: this._clientId });
                this.mqttClient.on('connect', this.emitter.onConnected);
                this.mqttClient.on('message', this.onMessage);
                resolve();
            });
        }
        return Promise.resolve();
    }

    public disconnect() {
        return new Promise((resolve) => {
            if (this.mqttClient) {
                this.mqttClient.end(false, () => {
                    this.emitter.onDisconnected();
                    resolve();
                });
            }
            return Promise.resolve();
        });
    }

    public subscribe(name: string) {
        if (this.mqttClient) {
            this.mqttClient.subscribe(name);
        }
    }

    public unsubscribe(name: string) {
        if (this.mqttClient) {
            this.mqttClient.unsubscribe(name);
        }
    }

    public sendMessage(topic: string, msg: any) {
        try {
            // remove left buttons
            const elements = document.querySelectorAll('button.left');
            elements.forEach(element => element.remove());

            const header = { userId: this.userId };
            const body = Object.assign(msg, { position: 'right', timestamp: new Date().getTime() });
            if (this.mqttClient) {
                this.mqttClient.publish(topic, JSON.stringify({ header, body }), (error?: Error, packet?: Packet) => {
                    if (error) {
                        console.error('Failed to publish message ' + error.message, error, packet);
                    } else {
                        console.debug('Successfully published message');
                    }
                });
            }

            const $this = this;
            return this.emitter.onPreRender(body, true).then(msg => {
                $this.renderer.render(msg, $this.sendMessage.bind($this, topic));
                return this.emitter.onPostRender(msg, true);
            },                                               console.error);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Initial request to make the system aware that the user is listening
     */
    public servus() {
        try {
            const header = { userId: this.userId };
            const body = { type: 'reception' };
            if (this.mqttClient) {
                this.mqttClient.publish(this.outboundDestination, JSON.stringify({ header, body }), (error?: Error, packet?: Packet) => {
                    if (error) {
                        console.error('Failed to publish servus message ' + error.message, error, packet);
                    } else {
                        console.debug('Successfully published message');
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    get idenityId(): string {
        return this._identityId;
    }

    get userId(): number {
        return this._userId;
    }

    get inboundDestination(): string {
        return this._inboundDestination;
    }

    get outboundDestination(): string {
        return this._outboundDestination;
    }

    private onMessage(topic: string, msg: string) {
        const message = JSON.parse(msg);
        if (message.type) {
            this.emitter.onMessage(Object.assign(message, { position: 'left' }));

            const $this = this;
            this.emitter.onPreRender(Object.assign(message, { position: 'left' }), false)
                .then(msg => {
                    if (msg == null) {
                        return null;
                    }
                    $this.renderer.render(Object.assign(msg, { position: 'left' }), $this.sendMessage.bind($this, topic));
                    return $this.emitter.onPostRender(Object.assign(msg, { position: 'left' }), false);
                });
        }
    }
}
