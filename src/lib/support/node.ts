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
     * Removes the given attributes from the node.
     *
     * @param qualifiers the attributes qualifiers
     */
    removeAttributes(...qualifiers: string[]):INode;

    /**
     * Returns the attribute value
     *
     * @param qualifier the attribute qualifier
     */
    getAttribute(qualifier: string): string | null


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
     * Removes the given classes from the node.
     *
     * @param classes the classes to remove
     */
    removeClasses(...classes: string[]): INode;

    /**
     * Check if classList contains className
     *
     * @param className the class which should be contained
     */
    containsClass(className: string): boolean;


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

    /**
     * Get the parent by class of the node
     */
    getParentByClass(className: string): INode | undefined

    toggle(): void;

    onClick(callback: (e: MouseEvent) => void, options?: AddEventListenerOptions): void;

    parent(): INode | null;

    removeChild(node: INode): void;

    unwrap(): HTMLElement;

    find(selector: string): INode;

    findAll(selector: string): Array<INode>;

    innerText(str?: string): INode;

    setStyle(map: {[key: string]: string}): INode;

    setName(name?: string): void;

    setId(id?: string): void;
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

    public removeAttributes(...qualifiers: string[]): INode {
        qualifiers.forEach(qualifier => {
            this.node.removeAttribute(qualifier);
        });
        return this;
    }

    public getAttribute(qualifier: string): string | null {
        return this.node.getAttribute(qualifier);
    }

    public addClasses(...classes: string[]): INode {
        classes.forEach(clazz => clazz.split(" ").forEach(it => this.node.classList.add(it)));
        return this;
    }

    public removeClasses(...classes: string[]): INode {
        classes.forEach(clazz => this.node.classList.remove(clazz));
        return this;
    }

    public containsClass(className: string): boolean {
        return this.node.classList.contains(className)
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

    public onClick(callback: (e: MouseEvent) => void, options?: AddEventListenerOptions) {
        const onClick = (e: MouseEvent) => {
            callback(e);

            e.stopPropagation();
            e.preventDefault();
        };
        this.node.addEventListener('click', onClick, options);
    }

    public unwrap(): HTMLElement {
        return this.node;
    }

    public find(selector: string): INode {
        return wrap(this.node.querySelector(selector) as HTMLElement)
    }

    public findAll(selector: string): Array<INode> {
        const elements = this.node.querySelectorAll(selector);
        const array: Array<INode> = [];
        elements.forEach(element => {
            array.push(wrap(element as HTMLElement));
        });
        return array
    }

    public setStyle(map: {[key: string]: string}): INode {
        for (let key in map) {
            this.node.style[key] = map[key];
        }
        return this;
    }

    public innerText(str?: string): INode {
        this.node.innerText = str ? str : "";
        return this
    }

    public parent(): INode | null {
        return this.node.parentElement ? wrap(this.node.parentElement) : null;
    }

    public removeChild(node: INode) {
        if(node) {
            this.node.removeChild(node.unwrap());
        }
    }

    public setName(name?: string): void {
        if(!name) return;
        this.node.setAttribute("name", name);
    }

    public setId(id?: string): void {
        if(!id) return;
        this.node.id = id
    }

    public getParentByClass(className: string): INode | undefined {
        const node = wrap(this.node);
        if (node.parent()) {
            let parent = node.parent();
            while (parent) {
                if (parent.containsClass(className)) {
                    return parent;
                }
                if (parent.parent()) {
                    parent = parent.parent();
                } else return
            }
        }
        return
    }

}
