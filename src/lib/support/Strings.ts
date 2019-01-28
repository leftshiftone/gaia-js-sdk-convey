export function split(str?:string, separator:string = ' ') {
    if (str === undefined || str === null) {
        return [];
    }
    return str.split(separator);
}
