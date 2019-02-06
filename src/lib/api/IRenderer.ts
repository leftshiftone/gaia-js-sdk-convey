import {IRenderable} from './IRenderable';
import {IStackeable} from './IStackeable';

export interface IRenderer {
    render(message: ISpecification | IRenderable, containerType?:IStackeable):HTMLElement[];
    appendContent(element: HTMLElement):void;
    appendSuggest(element: HTMLElement):void;
}
export interface ISpecification {
    type: string;
    elements?: ISpecification[];
    position?: "left" | "right";
    text?:string;
    name?:string;
    class?:string;
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
    exact?:boolean;
    checked?:String;
    maptype?:String;
    nerStrategies?:Map<string, any>;
}
