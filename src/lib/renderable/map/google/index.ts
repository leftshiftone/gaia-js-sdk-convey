import {ISpecification} from "../../../api";
import Properties from "../../Properties";
import node, {INode} from "../../../support/node";
import {IMarker} from "../IMarker";
import {InputContainer} from "../../../support/InputContainer";
import Map = google.maps.Map;
import LatLng = google.maps.LatLng;

export class GoogleMap {

    API = "https://maps.googleapis.com/maps/api/js?key=" + Properties.resolve("GOOGLE_MAPS_API_KEY");
    static DEFAULT_MARKER_ICON = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    static DEFAULT_SELECTED_MARKER_ICON = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    public map: Map | null = null;
    private readonly spec: ISpecification;
    private wrapper: INode;
    private markers: Array<google.maps.Marker> = [];

    constructor(spec: ISpecification) {
        this.spec = spec;
        this.wrapper = node("div");
    }

    public render(): HTMLElement {
        this.wrapper.addClasses("lto-map", "lto-map-google", "lto-left");
        this.wrapper.setId(this.spec.id);
        this.wrapper.setName(this.spec.name);
        InputContainer.setRequiredAttribute(this.wrapper.unwrap(), this.spec.required);
        if (this.spec.class !== undefined)
            this.wrapper.addClasses(this.spec.class);
        this.includeScript();
        return this.wrapper.unwrap();
    }

    private init() {
        this.map = this.initMap();
        this.setCenter();
        this.addMarkersToMap();
    }

    public addMarkersToMap() {
        if (!this.spec.src)
            return;

        GoogleMap.getMarkersFromSrc(this.spec.src).then((markers: Array<IMarker> | null) => {
            if (!markers)
                return;

            markers.forEach((marker: IMarker) => {
                const current = new google.maps.Marker({map: this.map!, position: marker.position});
                current.setValues({meta: marker.meta, active: marker.active});
                this.markers.push(current);
                current.get("active") ?
                    this.activateMarker(current) :
                    this.deactivateMarker(current);

                current.addListener("click", e => {
                    current.get("active") ?
                        this.deactivateMarker(current) :
                        this.activateMarker(current);
                    this.setMarkersToValue()
                });
            });
            this.setMarkersToValue()
        })
    }

    public initMap(): Map {
        return new google.maps.Map(this.wrapper.unwrap(), {center: {lat: 0, lng: 0}, zoom: 8});
    }

    public setCenter() {
        if (this.spec.centerBrowserLocation && navigator.geolocation)
            navigator.geolocation.getCurrentPosition(position =>
                this.map!.setCenter({lat: position.coords.latitude, lng: position.coords.longitude}));
        else if (this.spec.centerLat && this.spec.centerLng)
            this.map!.setCenter({lat: this.spec.centerLat, lng: this.spec.centerLng})
    }

    private static getMarkersFromSrc(src: string) {
        return fetch(src).then(data => data.json()).then(json => json.markers ? json.markers : null)
    }

    public deactivateMarker(marker: google.maps.Marker) {
        marker.setValues({active: false});
        marker.setIcon(this.spec.markerIcon ? this.spec.markerIcon : GoogleMap.DEFAULT_MARKER_ICON)
    }

    public activateMarker(marker: google.maps.Marker) {
        marker.setValues({active: true});
        marker.setIcon(this.spec.selectedMarkerIcon ? this.spec.selectedMarkerIcon : GoogleMap.DEFAULT_SELECTED_MARKER_ICON);
    }

    public setMarkersToValue() {
        const selectedMarkers: Array<{ position: LatLng, meta: any }> = [];
        this.markers.forEach(marker => {
            if (marker.get("active"))
                selectedMarkers.push({position: marker.getPosition()!, meta: marker.get("meta")});
        });

        selectedMarkers.length > 0 ?
            this.wrapper.addAttributes({value: JSON.stringify(selectedMarkers)}) :
            this.wrapper.removeAttributes("value")
    }

    public includeScript() {
        if (!document.querySelectorAll(`[src="${this.API}"]`).length) {
            document.body.appendChild(Object.assign(
                document.createElement('script'), {
                    type: 'text/javascript',
                    src: this.API,
                    onload: () => this.init()
                }));
        } else {
            this.init();
        }
    }
}
