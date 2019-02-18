import SampleData from './data/SampleData';

export default class SankeyOptions {
    public width:number = 500;
    public height:number = 300;
    public data:Promise<any> = Promise.resolve(SampleData);
    public color:Array<string> = ["#30c4c4", "#008d8d", "#0fb5b5", "#53d4d4", "#83e5e5"];
}
