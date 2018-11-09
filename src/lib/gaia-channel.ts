import {Emitter, EmitterAdapter} from './emitter';
import {Renderer} from './renderer';
import * as mqtt from 'mqtt';

export class GaiaChannel {

    private emitter: EmitterAdapter;
    private renderer: Renderer;
    private mqttClient?: mqtt.MqttClient;

    constructor(container: any, emitter: Emitter | null) {
        this.emitter = new EmitterAdapter(emitter);
        this.renderer = new Renderer(document.querySelector(container));
        this.onMessage = this.onMessage.bind(this);
    }

    public connect(url: any) {
        if (!this.mqttClient) {
            return new Promise((resolve) => {
                this.mqttClient = mqtt.connect(url, { clean: false, clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8) });
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

            const message = Object.assign(msg, { position: 'right', timestamp: new Date().getTime() });
            if (this.mqttClient) {
                this.mqttClient.publish(topic, JSON.stringify(message));
            }

            const $this = this;
            return this.emitter.onPreRender(message, true).then(msg => {
                $this.renderer.render(msg, $this.sendMessage.bind($this, topic));
                return this.emitter.onPostRender(msg, true);
            },                                                  console.error);
        } catch (err) {
            return Promise.reject(err);
        }
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
