export default class Bar3DOptions {
    public width:number = 500;
    public height:number = 500;
    public color:Array<String> = ["#30c4c4", "#008d8d", "#0fb5b5", "#53d4d4", "#83e5e5"];
    public duration:number = 1000;
    public startAngle:number = Math.PI / 6;
    public scale:number = 20;
    public origin:(w:number, h:number) => number[] = (w, h) => [w / 2, h / 2];
    public strokeWidth:number = 3;
    public toGroup:(e:number) => number = (d) => d / 0.2;
    public data:Promise<{x:number, y:number, z:number}[]> = Promise.resolve([]);
    public gridStroke:string = "black";
    public gridFill:string = "lightgray";
    public legendColor:string = "black";
    public textX: (d:any) => string = (d: any) => d[1] <= 1 ? d[1] : '';
    public textY: (d:any) => string = (d: any) => d[1] <= 1 ? d[1] : '';
    public textZ: (d:any) => string = (d: any) => d[1] <= 1 ? d[1] : '';
}
