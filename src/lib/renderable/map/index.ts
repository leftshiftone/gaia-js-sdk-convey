import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from "../Renderables";

import {OpenStreetMap} from "./osm";
import {GoogleMap} from "./google";

export class Map implements IRenderable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        switch (this.spec.maptype) {
            case "osm": return (new OpenStreetMap(this.spec)).render(renderer, isNested);
            case "google": return (new GoogleMap(this.spec)).render(renderer, isNested);
        }
        return document.createElement("div")
    }
}

Renderables.register("map", Map);
