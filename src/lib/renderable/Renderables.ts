/**
 * Renderables is a simple registry to register renderables.
 */
export default class Renderables {

    /**
     * The map where the renderables are stored
     */
    private static renderableMap = {};

    /**
     * Registers the property in the registry
     *
     * @param name the renderables name
     * @param renderable the renderables class
     */
    public static register(name: string, renderable: any) {
        this.renderableMap[name.toUpperCase()] = renderable;
    }

    /**
     * Returns the renderable from the registry
     *
     * @param name the renderables name
     */
    public static resolve(name: string) {
        return this.renderableMap[name.toUpperCase()];
    }

}
