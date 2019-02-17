import SampleData from './data/SampleData';

export default class HeatmapOptions {
    public itemSizeX:number = 18;
    public itemSizeY:number = 18;
    public color:string[] = ['rgb(30, 30, 30)', "#30c4c4", "#008d8d", "#0fb5b5", "#53d4d4", "#83e5e5"];
    public data:Promise<any> = Promise.resolve(SampleData);
}
