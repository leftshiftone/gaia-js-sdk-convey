export interface IRenderer {
    render(message: any, sendMessage: any):void;
}
export interface IRenderableSpec {
    type: string;
    elements: any[];
}
