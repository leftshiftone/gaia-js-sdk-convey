/**
 * @author benjamin.krenn@leftshift.one - 5/9/19.
 * @since 0.1.0
 */
export class ChoiceHandler {

    public static handle(choiceContainers: NodeListOf<Element>): Attr {
        const choices = {};
        choiceContainers.forEach((container) => {

            const name = (container as HTMLElement).dataset.name;
            if (name === undefined) {
                throw new Error("name is undefined");
            }
            this.addToContainer(name, this.toChoices(container, "input[type='checkbox']"), choices);
            this.addToContainer(name, this.toChoices(container, "input[type='radio']"), choices);

        });

        return choices as Attr;
    }

    private static addToContainer(name: string, items: ChoiceEntity[], container: any) {
        if (items.length > 0) {
            container[name] = items;
        }
    }

    private static toChoices(container: Element, selector: string): ChoiceEntity[] {
        return this.querySelectorAll(container, selector)
            .filter(this.filter(container))
            .map(e => new ChoiceEntity((e as HTMLElement).dataset.name || "", (e as HTMLInputElement).checked));
    }


    private static filter(container: Element) : (e: Element) => boolean {
        if ((container as HTMLElement).dataset.sieve === "true") {
            return (e: Element) => (e as HTMLInputElement).checked;
        }
        return (e: Element) => true;
    }

    private static querySelectorAll(container: Element, selector: string): Element[] {
        return [].slice.call(container.querySelectorAll(selector));
    }
}

class ChoiceEntity {
    readonly name: string;
    readonly value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }
}
