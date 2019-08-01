import {IListener, ISpecification} from '../api';
import {Defaults} from '../support/Defaults';

/**
 * Off switch listener implementation.
 */
export class OffSwitchListener implements IListener {

    private readonly txt: HTMLTextAreaElement;
    private readonly btn: HTMLButtonElement;

    constructor(txt?:HTMLTextAreaElement, btn?:HTMLButtonElement) {
        this.txt = txt || Defaults.textbox();
        this.btn = btn || Defaults.invoker();
    }

    /**
     * {@inheritDoc}
     */
    public onConnected(): void {
        // do nothing
    }

    /**
     * {@inheritDoc}
     */
    public onConnectionLost(): void {
        // do nothing
    }

    /**
     * {@inheritDoc}
     */
    public onDisconnected(): void {
        // do nothing
    }

    /**
     * {@inheritDoc}
     */
    public onError(error: string): void {
        // do nothing
    }

    /**
     * {@inheritDoc}
     */
    public onMessage(data: ISpecification): void {
        this.txt.disabled = this.switchOff(data);
        this.btn.disabled = this.switchOff(data);
    }

    public switchOff(data:ISpecification):boolean {
        this.txt.classList.remove("lto-off");
        this.btn.classList.remove("lto-off");
        if(data.nerStrategies === undefined) {
            this.txt.classList.add("lto-off");
            this.btn.classList.add("lto-off");
            return true
        } else {
            this.txt.focus();
            return false
        }
    }

}
