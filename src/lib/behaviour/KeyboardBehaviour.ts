import {IBehaviour} from '../api/IBehaviour';
import {MqttConnection} from '../connection/MqttConnection';
import {ChannelType} from '../support/ChannelType';
import {Defaults} from '../support/Defaults';

/**
 * IBehaviour implementation which listens for a keyup event with code 13 in order to publish
 * a text message to the outgoing text channel.
 */
export class KeyboardBehaviour implements IBehaviour {

    private readonly target:HTMLTextAreaElement;
    private readonly callback: (() => void) | undefined;

    constructor(target?:HTMLTextAreaElement, callback?: () => void) {
        this.target = target || Defaults.textbox();
        this.callback = callback;
    }

    /**
     * {@inheritDoc}
     */
    public bind(gateway:MqttConnection):void {
        this.target.addEventListener("keyup", ((ev) => {
            if (ev.key === "Enter") {
                const value = this.target.value;

                if (value.replace(/^\s+|\s+$/g, "") !== "") {
                    gateway.publish(ChannelType.TEXT, {type: "text", text: value});
                    this.target.value = "";
                    if(this.callback !== undefined) { this.callback() }
                }
            }
        }));
    }

}
