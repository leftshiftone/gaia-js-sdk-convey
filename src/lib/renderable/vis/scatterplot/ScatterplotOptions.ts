export default class ScatterplotOptions {
    public width:number = 800;
    public height:number = 400;
    public data:Promise<any> = Promise.resolve([]);
    public color:Array<string> = ["#30c4c4", "#008d8d", "#0fb5b5", "#53d4d4", "#83e5e5"];
}
