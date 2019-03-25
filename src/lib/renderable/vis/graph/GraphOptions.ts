export default class GraphOptions {
    public width:number = 500;
    public height:number = 500;
    public radius:number = 5;
    public data:Promise<any> = Promise.resolve({});
    public distance: (node:any, index:number, links:Array<any>) => number = () => 50;
    public collision: (node:any, index:number, nodes:Array<any>) => number = () => this.radius * 1.4;
    public charge: (node:any, index:number, data:Array<any>) => number = () => -20;
    public fontSize:number = 10;
}
