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
