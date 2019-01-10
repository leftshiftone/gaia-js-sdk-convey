import {IBehaviour} from '../api/IBehaviour';
import {MqttConnection} from '../connection/MqttConnection';
import {ChannelType} from '../support/ChannelType';

/**
 * IBehaviour implementation which listens for a keyup event with code 13 in order to publish
 * a text message to the outgoing text channel.
 */
export class KeyboardBehaviour implements IBehaviour {

    private readonly target:HTMLTextAreaElement;

    constructor(target:HTMLTextAreaElement) {
        this.target = target;
    }

    /**
     * {@inheritDoc}
     */
    public bind(gateway:MqttConnection):void {
        this.target.addEventListener("keyup", ((ev) => {
            if (ev.keyCode === 13) {
                const value = this.target.value;

                if (value.replace(/^\s+|\s+$/g, "") !== "") {
                    gateway.publish(ChannelType.TEXT, {type: "text", text: value});
                    this.target.value = "";
                }
            }
        }));
    }

}
