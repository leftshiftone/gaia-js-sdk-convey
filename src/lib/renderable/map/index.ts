import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from "../Renderables";

import {OpenStreetMap} from "./osm";
import {GoogleMap} from "./google";

export class Map implements IRenderable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        switch (this.spec.mapType) {
            case "osm": return (new OpenStreetMap(this.spec)).render(renderer, isNested);
            case "google": return (new GoogleMap(this.spec)).render();
        }
        return document.createElement("div")
    }
}

Renderables.register("map", Map);
