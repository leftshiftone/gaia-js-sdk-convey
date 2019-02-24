import SampleData from './data/SampleData';

export default class GraphOptions {
    public width:number = 500;
    public height:number = 500;
    public radius:number = 5;
    public nodeColor:Array<string> = ["#30c4c4", "#008d8d", "#0fb5b5", "#53d4d4", "#83e5e5"];
    public linkColor:string = "gray";
    public textColor:string = "gray";
    public data:Promise<any> = Promise.resolve(SampleData);
    public distance: (node:any, index:number, links:Array<any>) => number = () => 50;
    public linkWidth: (d:any) => number = () => 1;
    public fontSize:number = 10;
}
