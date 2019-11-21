import {ISpecification} from "../../../api";
import node, {INode} from "../../../support/node";
import {IMarker} from "../IMarker";
import {MarkerIcon} from "../MarkerIcon";
import {InputContainer} from "../../../support/InputContainer";
import {google} from "google-maps"
import Properties from "../../Properties";
import {closestByClass} from "../../../support/Elements";
import EventStream from "../../../event/EventStream";

declare const google: google;

export class GoogleMap {

    API = "https://maps.googleapis.com/maps/api/js?sensor=false&key=" + Properties.resolve("GOOGLE_MAPS_API_KEY");
    static DEFAULT_MARKER_ICON = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    static DEFAULT_SELECTED_MARKER_ICON = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    private readonly spec: ISpecification;
    private markers: Array<google.maps.Marker> = [];
    private markerIcon: MarkerIcon | null = null;
    private selectedMarkerIcon: MarkerIcon | null = null;
    private readonly osmMinZoom: number = 0;
    private readonly osmMaxZoom: number = 19;
    private readonly osmDefaultZoom: number = 8;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    public render(): HTMLElement {
        const wrapper = node("div");
        wrapper.addClasses("lto-map", "lto-map-google", "lto-left");
        wrapper.setId(this.spec.id);
        wrapper.setName(this.spec.name);
        InputContainer.setRequiredAttribute(wrapper.unwrap(), this.spec.required);
        if (this.spec.class !== undefined)
            wrapper.addClasses(this.spec.class);
        const label = node("div");
        label.addClasses("lto-map-label");
        const mapContainer = node("div");
        mapContainer.addClasses("lto-map-container");
        wrapper.appendChild(mapContainer);
        wrapper.appendChild(label);
        this.includeAPI().then(() => this.init(wrapper));
        return wrapper.unwrap();
    }

    private initMarkerIcons() {
        const markerSize = new google.maps.Size(
            Properties.resolve("GOOGLE_MAPS_MARKER_WIDTH") || 32,
            Properties.resolve("GOOGLE_MAPS_MARKER_HEIGHT") || 32);
        const selectedMarkerSize = new google.maps.Size(
            Properties.resolve("GOOGLE_MAPS_SELECTED_MARKER_WIDTH") || 32,
            Properties.resolve("GOOGLE_MAPS_SELECTED_MARKER_HEIGHT") || 32);

        this.markerIcon = new MarkerIcon(this.spec.markerIcon ? this.spec.markerIcon : GoogleMap.DEFAULT_MARKER_ICON, markerSize, markerSize);
        this.selectedMarkerIcon = new MarkerIcon(this.spec.selectedMarkerIcon ? this.spec.selectedMarkerIcon : GoogleMap.DEFAULT_SELECTED_MARKER_ICON, selectedMarkerSize, selectedMarkerSize);
    }

    private resetAllMarkers() {
        this.markers.forEach(marker => {
            this.deactivateMarker(marker)
        })
    }

    private init(wrapper: INode) {
        console.debug("init google maps");
        const map = GoogleMap.initMap(wrapper);
        this.setCenter(map);
        map.setZoom(this.getZoom());
        this.initMarkerIcons();
        this.addMarkersToMap(map, wrapper);
        this.setMarkersToValue(wrapper);

        EventStream.addListener("GAIA::map::reset::" + this.spec.name, () => {
                this.resetAllMarkers();
                this.setMarkersToValue(wrapper);
                this.setLabel("", wrapper);
            }
        );
    }

    public setLabel = (text: string, wrapper: INode) => {
        const labelWrapper = wrapper.find(".lto-map-label");
        if (!labelWrapper) return;
        labelWrapper.unwrap().innerHTML = text;
    };

    public addMarkersToMap(map: google.maps.Map, wrapper: INode) {
        if (!this.spec.src)
            return;

        let countSelections = 0;
        const maxSelections = this.spec.maxSelections || 1;
        let activeMarker: google.maps.Marker;

        GoogleMap.getMarkersFromSrc(this.spec.src).then((markers: Array<IMarker> | null) => {
            if (!markers)
                return;

            markers.forEach((marker: IMarker) => {
                const current = new google.maps.Marker({map: map, position: marker.position});
                current.setValues({context: {label: marker.label, meta: marker.meta, active: marker.active}});
                this.markers.push(current);
                current.get("context").active ?
                    this.activateMarker(current) :
                    this.deactivateMarker(current);

                current.addListener("click", () => {
                        if (maxSelections === 1) {
                            if (activeMarker) {
                                this.deactivateMarker(activeMarker);
                            }
                            this.activateMarker(current);
                            this.setLabel(current.get("context").label || "", wrapper);
                            activeMarker = current;
                        } else {
                            if (current.get("active")) {
                                countSelections -= 1;
                                this.deactivateMarker(current);
                            } else if (countSelections < maxSelections) {
                                countSelections += 1;
                                this.activateMarker(current);
                            }
                        }
                        this.setMarkersToValue(wrapper);
                    }
                );
            });
        })
    }

    public static initMap = (wrapper: INode) => new google.maps.Map(wrapper.find(".lto-map-container").unwrap(), {center: {lat: 0, lng: 0}, zoom: 8});

    public setCenter(map: google.maps.Map) {
        if (this.spec.centerBrowserLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                    map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
                }, error => {
                    console.debug("Unable to init google maps with current position");
                    if (this.spec.centerLat && this.spec.centerLng)
                        map.setCenter({lat: this.spec.centerLat, lng: this.spec.centerLng});
                }
            );
        } else if (this.spec.centerLat && this.spec.centerLng)
            map.setCenter({lat: this.spec.centerLat, lng: this.spec.centerLng})
    }

    private static getMarkersFromSrc = (src: string) => fetch(src).then(data => data.json()).then(json => json.markers ? json.markers : null);

    public deactivateMarker(marker: google.maps.Marker) {
        marker.get("context").active = false;
        marker.setIcon(this.markerIcon);
    }

    public activateMarker(marker: google.maps.Marker) {
        marker.get("context").active = true;
        marker.setIcon(this.selectedMarkerIcon);
    }

    public setMarkersToValue(wrapper: INode) {
        const selectedMarkers: Array<{ position: google.maps.LatLng, meta: Map<string, any> }> = [];
        this.markers.forEach(marker => {
            if (marker.get("context").active)
                selectedMarkers.push({position: marker.getPosition()!, meta: marker.get("context").meta});
        });

        const form: HTMLElement | null = closestByClass(wrapper.unwrap(), ["lto-form"]);

        if (form) form.classList.remove("lto-submitable");

        if (selectedMarkers.length > 0) {
            if (form) form.classList.add("lto-submitable");
            wrapper.addDataAttributes({value: JSON.stringify(selectedMarkers)})
        } else wrapper.removeAttributes("data-value")
    }

    public includeAPI = () => new Promise(resolve => {
        if (!document.head.querySelectorAll(`[src="${this.API}"]`).length) {
            const script = document.createElement('script') as HTMLScriptElement;
            script.onload = () => {
                console.debug("load google maps API");
                resolve();
            }
            script.type = 'text/javascript';
            script.src = this.API;
            document.head.appendChild(script)
        } else resolve()
    });

    private getZoom(): number {
        if (this.spec.zoom && this.spec.zoom >= this.osmMinZoom && this.spec.zoom <= this.osmMaxZoom) {
            return this.spec.zoom;
        } else if (this.spec.zoom && this.spec.zoom > this.osmMaxZoom) {
            return this.osmMaxZoom;
        } else if (this.spec.zoom && this.spec.zoom < this.osmMinZoom) {
            return this.osmMinZoom;
        }
        return this.osmDefaultZoom;
    }
}
