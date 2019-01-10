import {IBehaviour} from '../api/IBehaviour';
import {MqttConnection} from '../connection/MqttConnection';
import {ChannelType} from '../support/ChannelType';

/**
 * IBehaviour implementation which listens for a mouse click event in order to publish
 * a text message to the outgoing text channel.
 */
export class MouseBehaviour implements IBehaviour {

    private readonly target1: HTMLButtonElement;
    private readonly target2: HTMLTextAreaElement;

    constructor(target1: HTMLButtonElement, target2: HTMLTextAreaElement) {
        this.target1 = target1;
        this.target2 = target2;
    }

    public bind(gateway: MqttConnection): void {
        this.target1.addEventListener("click", (() => {
            const value = this.target2.value;

            if (value.replace(/^\s+|\s+$/g, "") !== "") {
                gateway.publish(ChannelType.TEXT, {type: "text", text: value});
                this.target2.value = "";
            }
        }));
    }

}
