export function closestByClass(element: HTMLElement, clazz: Array<string>): HTMLElement | null{
    let el = element;
    let b = false;
    while (!b) {
        el = el.parentNode as HTMLElement;
        if (!el || !el.classList) {
            return null;
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
