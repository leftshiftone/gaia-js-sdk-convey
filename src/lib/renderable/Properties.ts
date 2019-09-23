/**
 * Properties is a simple registry to register properties.
 *
 * Existing Properties:
 * <ul>
 *     <li>GOOGLE_MAPS_API_KEY</li>
 * </ul>
 */
export default class Properties {

    /**
     * The map where the properties are stored
     */
    private static propertiesMap = {};

    /**
     * Registers the property in the registry
     *
     * @param name the properties name
     * @param property the properties value
     */
    public static register(name: string, property: any) {
        this.propertiesMap[name.toUpperCase()] = property;
    }

    /**
     * Returns the property from the registry
     *
     * @param name the properties name
     */
    public static resolve(name: string) {
        return this.propertiesMap[name.toUpperCase()];
    }

}
