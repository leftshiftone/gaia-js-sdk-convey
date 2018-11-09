export default function wrap(node: HTMLElement | string) {
  if (typeof node === 'string') {
    return new Node(document.createElement(node));
  }
  return new Node(node);
}

class Node {

  private node: HTMLElement;

  constructor(node: HTMLElement) {
    this.node = node;
  }

    /**
     * Adds the given attributes to the node.
     *
     * @param map the attribute map
     */
  public addAttributes(map: {}): Node {
    Object.keys(map).forEach(key => {
      if (map.hasOwnProperty(key)) {
        this.node.setAttribute(key, map[key]);
      }
    });
    return this;
  }

    /**
     * Adds the given classes to the node.
     *
     * @param classes the classes to add
     */
  public addClasses(...classes: string[]): Node {
    classes.forEach(clazz => this.node.classList.add(clazz));
    return this;
  }

    /**
     * Appends the given node to the node.
     *
     * @param node the node to add
     */
  public appendChild(node: Node | string): Node {
    if (typeof node === 'string') {
      this.node.appendChild(document.createTextNode(node));
      return this;
    }
    this.node.appendChild(node.unwrap());
    return this;
  }

    /**
     * Adds the given class name to the node if missing. Removes it otherwise.
     *
     * @param className the class name
     */
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

  public onClick(callback: (e:MouseEvent) => void) {
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
