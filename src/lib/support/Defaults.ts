/**
 * This class contains the default control and container elements
 */
export class Defaults {

    /**
     * @return the default textbox: .lto-textbox
     */
    public static textbox(): HTMLTextAreaElement {
        if (document.getElementsByClassName("lto-textbox").length === 0) {
            throw new Error("no default element with class 'lto-textbox' found");
        }
        return document.getElementsByClassName("lto-textbox")[0] as HTMLTextAreaElement;
    }

    /**
     * @return the default invoker: .lto-invoker
     */
    public static invoker(): HTMLButtonElement {
        if (document.getElementsByClassName("lto-invoker").length === 0) {
            throw new Error("no default element with class 'lto-invoker' found");
        }
        return document.getElementsByClassName("lto-invoker")[0] as HTMLButtonElement;
    }

    /**
     * @return the default content container: .lto-content
     */
    public static content(): HTMLButtonElement {
        if (document.getElementsByClassName("lto-content").length === 0) {
            throw new Error("no default element with class 'lto-content' found");
        }
        return document.getElementsByClassName("lto-content")[0] as HTMLButtonElement;
    }

    /**
     * @return the default suggestion container: .lto-suggest
     */
    public static suggest(): HTMLButtonElement {
        if (document.getElementsByClassName("lto-suggest").length === 0) {
            throw new Error("no default element with class 'lto-suggest' found");
        }
        return document.getElementsByClassName("lto-suggest")[0] as HTMLButtonElement;
    }

}
