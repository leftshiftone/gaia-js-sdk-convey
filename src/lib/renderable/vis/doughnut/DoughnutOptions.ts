export default class DoughnutOptions {
    public width:number = 500;
    public height:number = 500;
    public doughnutRatio = 0.4;
    public data:Promise<any> = Promise.resolve([]);
    public color:Array<string> = ["#30c4c4", "#008d8d", "#0fb5b5", "#53d4d4", "#83e5e5"];
}
