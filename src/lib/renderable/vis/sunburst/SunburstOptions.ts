export default class SunburstOptions {
    public width: number = 500;
    public height: number = 500;
    public b = {w: 75, h: 20, s: 3, t: 10, r: 3};
    public legend: boolean = false;
    public data: Promise<any> = Promise.resolve({});
    public mapText = (text:string) => text;
    public filter:number = 0.005;
}
