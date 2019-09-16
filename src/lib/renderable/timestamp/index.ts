/**
 * The Timestamp class creates an small HTML element
 * and adds the current date and time to it. The class
 * lto-timestamp is added to allow CSS manipulations.
 *
 */
export class Timestamp {

    public static render() {
        const date = new Date();
        const f = (e: any) => e.toString().padStart(2, '0');
        const text = f(date.getHours()) + ':' + f(date.getMinutes());
        const timestamp = document.createElement('small');
        timestamp.classList.add('lto-timestamp');
        timestamp.appendChild(document.createTextNode(text));
        return timestamp;
    }
}
