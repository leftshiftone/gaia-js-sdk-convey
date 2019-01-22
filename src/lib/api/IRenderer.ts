import {IRenderable} from './IRenderable';

export interface IRenderer {
    render(message: ISpecification | IRenderable, containerType?:string):HTMLElement[];
    append(element: HTMLElement):void;
}
export interface ISpecification {
    type: string;
    elements?: ISpecification[];
    position?: "left" | "right";
    text?:string;
    name?:string;
    class?:string
    value?:string;
    source?:string;
    width?:string;
    height?:string;
    timestamp?:string;
    min?:string;
    max?:string;
    size?:string;
    step?:string;
    src?:string;
    horizontal?:string;
    nerStrategies?:Map<string, any>;
}
