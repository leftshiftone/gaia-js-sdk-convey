import {Emitter, EmitterAdapter} from './emitter';
import {Renderer} from './renderer';
import * as mqtt from 'mqtt';
import {Packet} from 'mqtt';
import {ChannelNameFactory} from "./support/ChannelNameFactory";
import {ChannelType} from "./support/ChannelType";

export class GaiaChannel {

    private emitter: EmitterAdapter;
    private renderer: Renderer;
    private mqttClient?: mqtt.MqttClient;
    private _clientId: string;
    private _identityId: string;
    private _userId: number;
    private _inboundNotificationDestination: string;
    private _inboundContextDestination: string;
    private _inboundTextDestination: string;
    private _outboundTextDestination: string;
    private callbacks: Map<ChannelType, (message:object) => void>;

    constructor(container: any, identityId: string, emitter: Emitter | null) {
        this.callbacks = new Map();
        this.emitter = new EmitterAdapter(emitter);
        this.renderer = new Renderer(document.querySelector(container));
        this._clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        this._identityId = identityId;
        this._userId = Math.floor(Math.random() * 10000000001); //todo: make user id more persistent for an actual user (e.g. cookie, etc)
        this._inboundNotificationDestination = ChannelNameFactory.clientChannelNameIn(this._clientId, this._identityId, ChannelType.NOTIFICATION);
        this._inboundContextDestination = ChannelNameFactory.clientChannelNameIn(this._clientId, this._identityId, ChannelType.CONTEXT);
        this._inboundTextDestination = ChannelNameFactory.clientChannelNameIn(this._clientId, this._identityId, ChannelType.TEXT);
        this._outboundTextDestination = ChannelNameFactory.clientChannelNameOut(this._clientId, this._identityId, ChannelType.TEXT);
        this.onMessage = this.onMessage.bind(this);
    }

    public connect(url: any) {
        if (!this.mqttClient) {
            return new Promise((resolve) => {
                this.mqttClient = mqtt.connect(url, {clean: false, clientId: this._clientId});
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

    private getChannelType(topic: string): ChannelType {
        return ChannelType[topic.match(/GAIA\/RAIN\/\w+\/\w+\/(\w+)\/in/)![1].toUpperCase()];;
    }

    public subscribe(destination: string, callback?: (message: object) => void) {
        if (this.mqttClient) {
            this.mqttClient.subscribe(destination);
        }

        if(callback !== undefined) {
            this.callbacks!.set(this.getChannelType(destination), callback)
        }
    }

    public unsubscribe(destination: string) {
        if (this.mqttClient) {
            this.mqttClient.unsubscribe(destination);
        }
    }

    public sendMessage(destination: string, msg: any) {
        console.debug('Sending message to destination ' + destination);
        try {
            // remove left buttons
            const elements = document.querySelectorAll('button.left');
            elements.forEach(element => element.remove());

            const header = {identityId: this.idenityId, clientId: this.clientId, userId: this.userId};
            const body = Object.assign(msg, {position: 'right', timestamp: new Date().getTime()});
            if (this.mqttClient) {
                this.mqttClient.publish(destination, JSON.stringify({header, body}), (error?: Error, packet?: Packet) => {
                    if (error) {
                        console.error('Failed to publish message ' + error.message, error, packet);
                    } else {
                        console.debug('Successfully published message ' + msg);
                    }
                });
            }

            const $this = this;
            return this.emitter.onPreRender(body, true).then(msg => {
                $this.renderer.render(msg, $this.sendMessage.bind($this, destination));
                return this.emitter.onPostRender(msg, true);
            }, console.error);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Initial request to make the system aware that the user is listening
     */
    public servus() {
        try {
            const header = {identityId: this.idenityId, clientId: this.clientId, userId: this.userId};
            const body = {type: 'reception'};
            if (this.mqttClient) {
                this.mqttClient.publish(this.outboundTextDestination, JSON.stringify({
                    header,
                    body,
                }), (error?: Error, packet?: Packet) => {
                    if (error) {
                        console.error('Failed to publish servus message ' + error.message, error, packet);
                    } else {
                        console.debug('Successfully published servus message');
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

    get clientId(): string {
        return this._clientId;
    }

    get userId(): number {
        return this._userId;
    }

    get inboundNotificationDestination(): string {
        return this._inboundNotificationDestination;
    }

    get inboundContextDestination(): string {
        return this._inboundContextDestination;
    }

    get inboundTextDestination(): string {
        return this._inboundTextDestination;
    }

    get outboundTextDestination(): string {
        return this._outboundTextDestination;
    }

    private onMessage(topic: string, msg: string) {
        console.debug('Received message ' + msg + ' from topic ' + topic);

        const channelType: ChannelType = this.getChannelType(topic);
        const message = JSON.parse(msg);

        if (channelType !== null) {
            switch (channelType) {
                case ChannelType.TEXT:
                    this.emitter.onMessage(Object.assign(message, {position: 'left'}));
                    const $this = this;
                    this.emitter.onPreRender(Object.assign(message, {position: 'left'}), false)
                        .then(msg => {
                            if (msg == null) {
                                return null;
                            }
                            $this.renderer.render(Object.assign(msg, {position: 'left'}), $this.sendMessage.bind($this, this.outboundTextDestination));
                            return $this.emitter.onPostRender(Object.assign(msg, {position: 'left'}), false);
                        });
                    break;
                case ChannelType.CONTEXT:
                    this.callbacks!.get(ChannelType.CONTEXT)!(message);
                    break;
                case ChannelType.AUDIO:
                    break; // TODO Implementation
                case ChannelType.NOTIFICATION:
                    break; // TODO Implementation
                default :
                    console.debug("No such channel " + channelType + "defined")
            }
        }
    }
}
