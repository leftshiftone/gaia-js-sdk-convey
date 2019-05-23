export function closestByClass(element: any, clazz: Array<string>): HTMLElement {
    let el = element;
    let b = false;
    while (!b) {
        el = el.parentNode as HTMLElement;
        if (!el || !el.classList) {
            throw new Error("could not find required classes");
        }
        clazz.forEach(e => {
                if (el.classList.contains(e)) {
                    b = true;
                }
            }
        );
    }
    return el;
}

export function removeAllEventListeners(element: any) {
    if (typeof element._eventListeners == "undefined" || element._eventListeners.length == 0) {
        return;
    }
    for (let i = 0, len = element._eventListeners.length; i < len; i++) {
        let event = element._eventListeners[i];
        element.removeEventListener(event.event, event.callback);
    }
    element._eventListeners = [];
}
