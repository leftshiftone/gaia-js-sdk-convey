export default class Renderables {

    private static renderableMap = {};

    public static register(name: string, renderable: any) {
        this.renderableMap[name.toUpperCase()] = renderable;
    }

    public static resolve(name: string) {
        return this.renderableMap[name.toUpperCase()];
    }

}
