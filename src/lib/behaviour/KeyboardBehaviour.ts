import {IBehaviour} from '../api/IBehaviour';
import {MqttConnection} from '../connection/MqttConnection';
import {ChannelType} from '../support/ChannelType';

export class KeyboardBehaviour implements IBehaviour {

    private readonly target:HTMLTextAreaElement;

    constructor(target:HTMLTextAreaElement) {
        this.target = target;
    }

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
