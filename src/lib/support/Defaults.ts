export class Defaults {

    public static textbox(): HTMLTextAreaElement {
        if (document.getElementsByClassName("lto-textbox").length === 0) {
            throw new Error("no default element with class 'lto-textbox' found");
        }
        return document.getElementsByClassName("lto-textbox")[0] as HTMLTextAreaElement;
    }

    public static invoker(): HTMLButtonElement {
        if (document.getElementsByClassName("lto-invoker").length === 0) {
            throw new Error("no default element with class 'lto-invoker' found");
        }
        return document.getElementsByClassName("lto-invoker")[0] as HTMLButtonElement;
    }

    public static content(): HTMLButtonElement {
        if (document.getElementsByClassName("lto-content").length === 0) {
            throw new Error("no default element with class 'lto-content' found");
        }
        return document.getElementsByClassName("lto-content")[0] as HTMLButtonElement;
    }

}
