export default function wrap(node: HTMLElement | string) : INode {
    if (typeof node === 'string') {
        return new Node(document.createElement(node));
    }
    return new Node(node);
}

export interface INode {
    /**
     * Adds the given attributes to the node.
     *
     * @param map the attribute map
     */
    addAttributes(map: {}): INode;


    /**
     * Adds the given attributes to the nodes dataset
     *
     * @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
     */
    addDataAttributes(map: {}): INode;

    /**
     * Adds the given classes to the node.
     *
     * @param classes the classes to add
     */
    addClasses(...classes: string[]): INode;

    /**
     * Appends the given node to the node.
     *
     * @param node the node to add
     */
    appendChild(node: INode | string): INode;

    /**
     * Adds the given class name to the node if missing. Removes it otherwise.
     *
     * @param className the class name
     */
    toggleClass(className: string): void;

    toggle(): void;

    onClick(callback: (e: MouseEvent) => void): void;

    unwrap(): HTMLElement;
}

class Node implements INode {

    private readonly node: HTMLElement;

    constructor(node: HTMLElement) {
        this.node = node;
    }

    public addAttributes(map: {}): INode {
        Object.keys(map).forEach(key => {
            if (map.hasOwnProperty(key)) {
                this.node.setAttribute(key, map[key]);
            }
        });
        return this;
    }

    public addDataAttributes(map: {}): INode {
        Object.keys(map).forEach(key => {
            if (map.hasOwnProperty(key)) {
                this.node.dataset[key] = map[key];
            }
        });
        return this;
    }

    public addClasses(...classes: string[]): INode {
        classes.forEach(clazz => this.node.classList.add(clazz));
        return this;
    }


    public appendChild(node: Node | string): INode {
        if (typeof node === 'string') {
            this.node.appendChild(document.createTextNode(node));
            return this;
        }
        this.node.appendChild(node.unwrap());
        return this;
    }

    public toggleClass(className: string): void {
        if (this.node.classList.contains(className)) {
            this.node.classList.remove(className);
        } else {
            this.node.classList.add(className);
        }
    }

    public toggle() {
        if (this.node instanceof HTMLInputElement) {
            (this.node as HTMLInputElement).checked = !(this.node as HTMLInputElement).checked;
        }
    }

    public onClick(callback: (e: MouseEvent) => void) {
        const onClick = (e: MouseEvent) => {
            callback(e);

            e.stopPropagation();
            e.preventDefault();
        };
        this.node.addEventListener('click', onClick);
    }

    public unwrap(): HTMLElement {
        return this.node;
    }

}
