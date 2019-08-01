import {IRenderer, ISpecification} from "../../../api/IRenderer";
import * as GoogleMapsLoader from 'google-maps';
import {IMarker} from "../IMarker";
import Properties from "../../Properties";
import LatLng = google.maps.LatLng;

type LatLngLiteral = google.maps.LatLngLiteral;

export class GoogleMap {

    private center: LatLngLiteral;
    private markers: Array<IMarker>;
    private spec: ISpecification;

    constructor(spec: ISpecification) {
        this.center = {lat: 0, lng: 0};
        this.markers = [];
        this.spec = spec;
        this.getMarkersAndCenter(spec.src);
    }

    public getMarkersAndCenter(src: string | undefined) {
        if (src !== undefined) {
            fetch(src).then(response =>
                response.json().then(data => {
                    this.markers = data.markers;
                    if(this.spec.centerLat !== undefined && this.spec.centerLng !== undefined) {
                        this.center = {
                            lng: this.spec.centerLng,
                            lat: this.spec.centerLat
                        }
                    } else if (this.spec.centerBrowserLocation) {
                        this.getBrowserLocation().then((center: LatLngLiteral) => this.center = center)
                    } else {
                        this.center = data.center;
                    }
                }));
        } else {
            if(this.spec.centerLat !== undefined && this.spec.centerLng !== undefined) {
                this.center = {
                    lng: this.spec.centerLng,
                    lat: this.spec.centerLat
                }
            } else if (this.spec.centerBrowserLocation) {
                this.getBrowserLocation().then((center: LatLngLiteral) => this.center = center)
            } else {
                this.center = {lat: 0, lng: 0};
            }
        }
    }

    public getBrowserLocation(): Promise<LatLngLiteral> {
        return new Promise<LatLngLiteral>((resolve) => navigator.geolocation.getCurrentPosition((loc: Position) =>
            resolve({lat: loc.coords.latitude, lng: loc.coords.longitude})
        ))
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {

        const container = document.createElement("div");
        container.classList.add("lto-map");
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => container.classList.add(e));
        }
        if (isNested) {
            container.classList.add("lto-nested")
        }
        container.setAttribute("name", this.spec.name || "");

        // @ts-ignore
        GoogleMapsLoader.LANGUAGE = "de";
        // @ts-ignore
        GoogleMapsLoader.KEY = Properties.resolve("GOOGLE_MAPS_API_KEY");

        setTimeout(() => {
            GoogleMapsLoader.load((google: GoogleMapsLoader.google) => {
                const map = new google.maps.Map(document.getElementsByClassName("lto-map").item(0), {
                    center: this.center,
                    zoom: 12,
                    minZoom: 7,
                    maxZoom: 14,
                    streetViewControl: false,
                    mapTypeControl: false
                });

                const ICON_ACTIVE = {
                    url: 'http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png',
                    scaledSize: new google.maps.Size(30, 30)
                };
                const ICON_INACTIVE = {
                    url: "https://cdn2.iconfinder.com/data/icons/basic-ict-line-icons/100/30-512.png",
                    scaledSize: new google.maps.Size(30, 30)
                };
                const ICON_SELECTED = {
                    url: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                    scaledSize: new google.maps.Size(30, 30)
                };

                const circle = new google.maps.Circle({
                    strokeColor: '#6ebd87',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#6ebd87',
                    fillOpacity: 0.35,
                    map: map,
                    radius: 2000
                });

                if (this.markers !== undefined) {

                    const _markers: Array<[google.maps.Marker, boolean]> = [];

                    this.markers.forEach((marker: IMarker) => {
                        const m = new google.maps.Marker({
                            position: marker.position,
                            map: map,
                            icon: marker.active ? ICON_ACTIVE : ICON_INACTIVE,
                        });

                        m.set("meta", marker.meta);
                        _markers.push([m, marker.active])
                    });

                    if (this.spec.exact) {
                        let selectedMarker: google.maps.Marker;
                        _markers.forEach(marker => {
                            if (marker[1]) { // is active?
                                marker[0].addListener("click", () => {
                                    if (selectedMarker !== undefined) {
                                        selectedMarker.setIcon(ICON_ACTIVE)
                                    }
                                    setValueToContainer({
                                        position: marker[0].getPosition(),
                                        meta: marker[0].get("meta")
                                    });
                                    marker[0].setIcon(ICON_SELECTED);
                                    selectedMarker = marker[0];
                                })
                            }
                        })
                    } else {
                        map.addListener("center_changed", () => {
                            drawCircle();
                            const markersInCircle = getMarkersInCircle(_markers);
                            if (markersInCircle !== {markers: []}) {
                                setValueToContainer(markersInCircle)
                            }
                        });

                        drawCircle();
                        const markersInCircle = getMarkersInCircle(_markers);
                        if (markersInCircle !== {markers: []}) {
                            setValueToContainer(markersInCircle)
                        }
                    }
                } else {
                    if (this.spec.exact) {
                        const marker = new google.maps.Marker({position: {lat: 0, lng: 0}});
                        map.addListener("click", ev => {
                            marker.setMap(map);
                            marker.setPosition(ev.latLng);
                            setValueToContainer({position: marker.getPosition()})
                        })
                    } else {
                        map.addListener("center_changed", () => {
                            drawCircle();
                            setValueToContainer({position: circle.getCenter()})
                        });

                        drawCircle();
                        setValueToContainer({position: circle.getCenter()})
                    }
                }

                function setValueToContainer(value: object) {
                    container.setAttribute("value", JSON.stringify(value));
                }

                function drawCircle() {
                    circle.setCenter(map.getCenter());
                    circle.setMap(map);
                }

                function getMarkersInCircle(markers: Array<[google.maps.Marker, boolean]> = []): { markers: any } {
                    const markersInCircle: { markers: any } = {markers: []};
                    markers.forEach(marker => {
                        if (marker[1]) {
                            if (marker[0].getPosition() && circle.getBounds().contains(<LatLng>marker[0].getPosition())) {
                                markersInCircle.markers.push({
                                    position: marker[0].getPosition(),
                                    meta: marker[0].get("meta")
                                });
                                marker[0].setIcon(ICON_SELECTED);
                            } else {
                                marker[0].setIcon(ICON_ACTIVE);
                            }
                        }
                    });
                    return markersInCircle;
                }

            });
        }, 500);

        return container;
    }

}
