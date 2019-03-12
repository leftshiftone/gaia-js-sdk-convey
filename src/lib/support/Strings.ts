export function split(str?:string, separator:string = ' ') {
    if (str === undefined || str === null) {
        return [];
    }
    return str.split(separator);
}

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
