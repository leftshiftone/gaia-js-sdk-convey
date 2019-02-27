export default class Properties {

    private static propertiesMap = {};

    public static register(name: string, property: any) {
        this.propertiesMap[name.toUpperCase()] = property;
    }

    public static resolve(name: string) {
        return this.propertiesMap[name.toUpperCase()];
    }

}
