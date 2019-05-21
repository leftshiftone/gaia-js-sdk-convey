import {IRenderable} from './IRenderable';
import {IStackeable} from './IStackeable';

export interface IRenderer {
    render(message: ISpecification | IRenderable, containerType?: IStackeable): HTMLElement[];

    appendContent(element: HTMLElement): void;

    appendSuggest(element: HTMLElement): void;
}

export interface ISpecification {
    type: string;
    elements?: ISpecification[];
    position?: "left" | "right";
    text?: string;
    name?: string;
    id?: string;
    class?: string;
    value?: string;
    source?: string;
    width?: string;
    height?: string;
    timestamp?: string;
    min?: string;
    max?: string;
    size?: string;
    step?: string;
    src?: string;
    horizontal?: string;
    exact?: boolean;
    checked?: string;
    mapType?: string;
    valueType?: string;
    centerLat?: number;
    centerLng?: number;
    required?: boolean;
    regex?: string;
    placeholder?: string;
    centerBrowserLocation?: boolean;
    nerStrategies?: Map<string, any>;
    accept?: string;
    maxSize?: number;
    storeInContext?: boolean;
    destination?: string;
    countdownInSec?: number;
    values?: Array<string>;
    sieve?: boolean;
    selected?: boolean;
}
