import {IBehaviour} from '../api/IBehaviour';
import {MqttConnection} from '../connection/MqttConnection';
import {ChannelType} from '../support/ChannelType';
import {Defaults} from '../support/Defaults';
import {IRenderer, ISpecification} from '../api/IRenderer';

/**
 * IBehaviour implementation which listens for a keyup event with code 13 in order to publish
 * a text message to the outgoing text channel.
 */
export class KeyboardBehaviour implements IBehaviour {

    private readonly target: HTMLTextAreaElement;
    private readonly renderer: IRenderer;
    private readonly callback: (() => void) | undefined;

    constructor(renderer: IRenderer, target?: HTMLTextAreaElement, callback?: () => void) {
        this.target = target || Defaults.textbox();
        this.renderer = renderer;
        this.callback = callback;
    }

    /**
     * {@inheritDoc}
     */
    public bind(gateway: MqttConnection): void {
        this.target.addEventListener("keyup", ((ev) => {
            if (ev.key === "Enter") {
                const value = this.target.value;

                if (value.replace(/^\s+|\s+$/g, "") !== "") {
                    gateway.publish(ChannelType.TEXT, {type: "text", text: value});
                    this.target.value = "";

                    const payload = {type:"text", text: value, position:"right"} as ISpecification;
                    this.renderer.render(payload).forEach(e => this.renderer.appendContent(e));

                    if (this.callback !== undefined) {
                        this.callback();
                    }
                }
            }
        }));
    }

}
