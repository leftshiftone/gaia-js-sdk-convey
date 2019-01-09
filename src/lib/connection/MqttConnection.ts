import {IListener} from '../api/IListener';
import * as mqtt from 'mqtt';
import {ChannelNameFactory} from "../support/ChannelNameFactory";
import {ChannelType} from "../support/ChannelType";
import {IBehaviour} from '../api/IBehaviour';
import {IRenderer} from '../api/IRenderer';
import {uuid} from '../support/Uuid';

export class MqttConnection {

    private readonly callbacks: Map<ChannelType, (message: object) => void> = new Map();

    private readonly emitter: IListener;
    private readonly renderer: IRenderer;
    private readonly clientId: string;
    private readonly identityId: string;
    private readonly userId: string;
    private readonly mqttClient: mqtt.MqttClient;

    constructor(url: string, identityId: string, renderer: IRenderer, emitter: IListener) {
        this.emitter = emitter;
        this.renderer = renderer;
        this.clientId = uuid();
        this.identityId = identityId;
        this.userId = uuid();

        this.mqttClient = mqtt.connect(url, {clean: false, clientId: this.clientId});
        this.mqttClient.on('connect', this.emitter.onConnected);
        this.mqttClient.on('message', this.onMessage.bind(this));
    }

    /**
     * Disconnects from the mqtt connection.
     */
    public disconnect = () => this.mqttClient.end(false, this.emitter.onDisconnected);

    /**
     * Subscribes to the given destination.
     *
     * @param type the channel type
     * @param callback the callback function
     */
    public subscribe(type: ChannelType, callback: (message: object) => void) {
        const destination = this.incoming(type);
        this.mqttClient.subscribe(destination);

        const channelType = ChannelType.match(destination);
        this.callbacks!.set(channelType, callback);
    }

    /**
     * Unsubscribes from the given destination
     *
     * @param destination the destination to unsubscribe from
     */
    public unsubscribe = (destination: string) => this.mqttClient.unsubscribe(destination);

    /**
     * Sends the given message to the given destination.
     *
     * @param channelType the channel type
     * @param msg the message
     */
    public publish(channelType: ChannelType, msg: any) {
        const destination = this.outgoing(channelType);
        console.debug('Sending message to destination ' + destination);
        try {
            // remove left buttons
            const elements = document.querySelectorAll('button.left');
            elements.forEach(element => element.remove());

            const body = Object.assign(msg, {position: 'right', timestamp: new Date().getTime()});
            const payload = JSON.stringify({body, header: this.header()});

            this.mqttClient.publish(destination, payload, this.errorHandler(msg));
            return this.renderer.render(body, this.publish.bind(this, destination));
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Initial request to make the system aware that the user is listening.
     */
    public reception() {
        const payload = JSON.stringify({header: this.header(), type: 'reception'});
        this.mqttClient.publish(this.outgoing(ChannelType.TEXT), payload, this.errorHandler("reception"));
    }

    /**
     * Executes the registered channel type callback.
     *
     * @param type the cannel type
     * @param msg the message
     */
    private callback = (type: ChannelType, msg: object) => (this.callbacks.get(type) || console.warn)(msg);

    private onMessage(topic: string, msg: string) {
        console.debug('Received message ' + msg + ' from topic ' + topic);

        const channelType: ChannelType = ChannelType.match(topic);
        const message = JSON.parse(msg);

        if (channelType !== null) {
            switch (channelType) {
                case ChannelType.TEXT:
                    const payload = Object.assign(message, {position: 'left'});

                    this.emitter.onMessage(payload);
                    this.renderer.render(payload, this.publish.bind(this, this.outgoing(ChannelType.TEXT)));

                    this.callback(channelType, message);
                    break;
                case ChannelType.CONTEXT:
                    this.callback(channelType, message);
                    break;
                case ChannelType.AUDIO:
                    break; // TODO Implementation
                case ChannelType.NOTIFICATION:
                    break; // TODO Implementation
                default :
                    console.debug("No such channel " + channelType + "defined");
            }
        }
    }

    /**
     * Binds the given IBehaviour to the MqttConnection.
     *
     * @param behaviour
     */
    public bind = (behaviour: IBehaviour) => behaviour.bind(this);

    private outgoing = (type: ChannelType) => ChannelNameFactory.clientOutgoing(this.clientId, this.identityId, type);
    private incoming = (type: ChannelType) => ChannelNameFactory.clientIncoming(this.clientId, this.identityId, type);

    private errorHandler(msg: any) {
        return (error?: Error, packet?: mqtt.Packet) => {
            if (error) {
                console.error('Failed to publish message ' + error.message, error, packet);
            } else {
                console.debug('Successfully published message ' + msg);
            }
        };
    }

    private header = () => ({identityId: this.identityId, clientId: this.clientId, userId: this.userId});

}
