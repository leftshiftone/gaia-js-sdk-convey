/**
 * Function provides a save string split functionality. If
 * the given string to split is undefined or null an empty
 * string array is returned.
 *
 * @param str string to split
 * @param separator separator of the split
 * @returns string []
 */
export function split(str?:string, separator:string = ' ') {
    if (str === undefined || str === null) {
        return [];
    }
    return str.split(separator);
}

/**
 * Function returns the number value of the given key, if
 * the key is not found the key is added and the current map
 * size is set as value.
 *
 * @param idMap Map with string key and number value
 * @param name string key
 * @returns number of the given key.
 */
export function getDigit(idMap:Map<string, number>, name: string): number {
    if (!idMap.has(name)) {
        idMap.set(name, idMap.size);
    }
    return idMap.get(name) as number;
}

export function getLetter(idMap:Map<string, number>, name: string): string {
    const digit = getDigit(idMap, name);
    switch (digit % 5) {
        case 0:
            return "A";
        case 1:
            return "B";
        case 2:
            return "C";
        case 3:
            return "D";
        default:
            return "E";
    }
}
