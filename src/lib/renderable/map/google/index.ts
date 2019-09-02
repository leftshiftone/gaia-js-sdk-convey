import {IRenderer, ISpecification} from "../../../api";
import Properties from "../../Properties";
import node, {INode} from "../../../support/node";
import {IMarker} from "../IMarker";
import Map = google.maps.Map;

export class GoogleMap {

    API = "https://maps.googleapis.com/maps/api/js?key=" + Properties.resolve("GOOGLE_MAPS_API_KEY");
    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const wrapper = node("div");
        wrapper.addClasses("lto-map");
        wrapper.setId(this.spec.id);
        wrapper.setName(this.spec.name);
        this.includeScript(wrapper);
        return wrapper.unwrap();
    }

    public static init(wrapper: INode, spec: ISpecification) {
        const map = GoogleMap.initMap(wrapper);

        GoogleMap.initCenter(map, spec);

        const markers: Array<google.maps.Marker> = [];
        GoogleMap.initMarkers(map, markers, spec);
    }

    public static initMarkers(map: Map, markers: Array<google.maps.Marker>, spec: ISpecification) {
        if(!spec.src)
            return;

            fetch(spec.src).then(data => data.json()).then(json => {
                if(!json.markers)
                    return;

                json.markers.forEach((marker: IMarker) => {
                    const current = new google.maps.Marker({map,opacity: 0.6, position: marker.position})
                    current.addListener("click", e => {
                        current.setValues({active: !current.get("active")});
                    });
                    markers.push(current);
                });
            })
    }

    public static initMap(wrapper: INode): Map {
        return new google.maps.Map(wrapper.unwrap(), {center: {lat: 0, lng: 0}, zoom: 8});
    }

    private static initCenter(map: Map, spec: ISpecification) {
        if (spec.centerBrowserLocation && navigator.geolocation)
           navigator.geolocation.getCurrentPosition(position =>
               map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude}));
        else if (spec.centerLat && spec.centerLng)
            map.setCenter({lat: spec.centerLat, lng: spec.centerLng})
    }

    private includeScript(wrapper: INode) {
        if (!document.querySelectorAll(`[src="${this.API}"]`).length) {
            document.body.appendChild(Object.assign(
                document.createElement('script'), {
                    type: 'text/javascript',
                    src: this.API,
                    onload: () => GoogleMap.init(wrapper, this.spec)
                }));
        } else {
            GoogleMap.init(wrapper, this.spec);
        }
    }

}
