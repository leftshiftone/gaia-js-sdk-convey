export function categorize(n:number, classes:number = 5) {
    return Math.floor(n % classes);
}
