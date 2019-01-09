import {IRenderable} from './IRenderable';

export interface IRenderer {
    render(message: ISpecification | IRenderable, append: boolean):HTMLElement[];
}
export interface ISpecification {
    type: string;
    elements: any[];
    position?: "left" | "right";
    text?:string;
    name?:string;
    value?:string;
    source?:string;
    width?:string;
    height?:string;
}
