export default class SunburstOptions {
    public width: number = 500;
    public height: number = 500;
    public b = {w: 75, h: 20, s: 3, t: 10, r: 3};
    public legend: boolean = false;
    public data: Promise<any> = Promise.resolve({});
    public color:Array<String> = ["#30c4c4", "#008d8d", "#0fb5b5", "#53d4d4", "#83e5e5"];
    public mapText = (text:string) => text;
}
