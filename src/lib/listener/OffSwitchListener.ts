import {IListener} from '../api/IListener';
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
    public onMessage(data: any): void {
        this.txt.disabled = false;
        this.btn.disabled = false;
    }

  //  protected switchOff(data:ISpecification):boolean {
  //      if ((data.nerStrategies || new Map<string, any>()).has("email")) {
  //          return false;
  //      }
  //      if ((data.nerStrategies || new Map<string, any>()).has("text")) {
  //          return false;
  //      }
  //      return true;
  //  }

}
