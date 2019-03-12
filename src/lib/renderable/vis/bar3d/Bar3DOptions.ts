export default class Bar3DOptions {
    public width:number = 500;
    public height:number = 500;
    public duration:number = 1000;
    public startAngle:number = Math.PI / 6;
    public scale:number = 20;
    public origin:(w:number, h:number) => number[] = (w, h) => [w / 2, h / 2];
    public toGroup:(e:number) => number = (d) => Math.min(4, Math.floor(Math.abs(d) / 2));
    public data:Promise<{x:number, y:number, z:number}[]> = Promise.resolve([]);
    public textX: (d:any) => string = (d: any) => d[1] <= 1 ? d[1] : '';
    public textY: (d:any) => string = (d: any) => d[1] <= 1 ? d[1] : '';
    public textZ: (d:any) => string = (d: any) => d[1] <= 1 ? d[1] : '';
}
