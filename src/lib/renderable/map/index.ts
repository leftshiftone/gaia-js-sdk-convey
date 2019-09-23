import {IRenderer, ISpecification, IRenderable} from '../../api';
import Renderables from "../Renderables";

import {OpenStreetMap} from "./osm";
import {GoogleMap} from "./google";

/**
 * Implementation of the 'map' markup element and has been
 * added to provide the integration of google maps or open
 * street map depending on the value of the mapType attribute
 * in the markup. The class lto-map is added to allow CSS manipulations.
 * If the mapType is 'google' the user needs to add the
 * GOOGLE_MAPS_API_KEY to the {@link Properties} registry.
 *
 * @see {@link IRenderable}
 */
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
