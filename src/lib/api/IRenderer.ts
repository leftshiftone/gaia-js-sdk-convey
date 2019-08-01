import {IRenderable} from './IRenderable';
import {IStackeable} from './IStackeable';
import { ISpecification } from './ISpecification';

export interface IRenderer {
    render(message: ISpecification | IRenderable, containerType?: IStackeable): HTMLElement[];

    appendContent(element: HTMLElement): void;

    appendSuggest(element: HTMLElement): void;
}

