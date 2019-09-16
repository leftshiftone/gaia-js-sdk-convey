/**
 * Function combines one or more arrays to a list.
 *
 * @param list
 * @returns list
 */
export function flatten(list:any[]) {
    return [].concat(...list);
}
