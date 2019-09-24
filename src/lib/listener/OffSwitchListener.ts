import {IPacket, IListener, ISpecification} from '../api';
import {Defaults} from '../support/Defaults';

/**
 * @inheritDoc
 *
 * Off switch listener implementation.
 *
 * The textbox and the invoker will be disabled when
 * the incoming message doesn't contain a NER strategy.
 */
export class OffSwitchListener implements IListener {

    private readonly txt: HTMLTextAreaElement;
    private readonly btn: HTMLButtonElement;

    constructor(txt?: HTMLTextAreaElement, btn?: HTMLButtonElement) {
        this.txt = txt || Defaults.textbox();
        this.btn = btn || Defaults.invoker();
    }

    /**
     * @inheritDoc
     */
    public onConnected(): void {
        // do nothing
    }

    /**
     * @inheritDoc
     */
    public onConnectionLost(): void {
        // do nothing
    }

    /**
     * @inheritDoc
     */
    public onDisconnected(): void {
        // do nothing
    }

    /**
     * @inheritDoc
     */
    public onError(error: string): void {
        // do nothing
    }

    /**
     * @inheritDoc
     */
    public onPacketSend(packet: IPacket): void {
        // do nothing
    }

    /**
     * @inheritDoc
     */
    public onMessage(data: ISpecification): void {
        this.switchOff(data.nerStrategies);
    }

    /**
     * Sets the disabled flag and adds the CSS class
     * lto-off to the invoker and textbox, if the no
     * NER strategy is passed
     *
     * @param nerStrategies the NER strategy which
     * is used in the current message
     */
    public switchOff(nerStrategies?: Map<string, any>): void {
        this.txt.classList.remove("lto-off");
        this.btn.classList.remove("lto-off");

        if (nerStrategies === undefined) {
            this.txt.classList.add("lto-off");
            this.btn.classList.add("lto-off");
            this.txt.disabled = true;
            this.btn.disabled = true;
        } else {
            this.txt.focus();
            this.txt.disabled = false;
            this.txt.disabled = false;
        }
    }

}
