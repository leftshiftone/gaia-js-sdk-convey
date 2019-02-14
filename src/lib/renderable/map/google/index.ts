import {IRenderer, ISpecification} from "../../../api/IRenderer";
import GoogleMapsLoader = require('google-maps');
import LatLngLiteral = google.maps.LatLngLiteral;
import {IMarker} from "../IMarker";

export class GoogleMap {

    private center: LatLngLiteral;
    private markers: Array<IMarker>;
    private spec: ISpecification;

    constructor(spec: ISpecification) {
        this.center = {lat: 0, lng: 0};
        this.markers = [];
        this.spec = spec;
        this.getJSONfromURL(spec.src || "");
    }

    public getJSONfromURL(src: string) {
        fetch(src).then(response =>
            response.json().then(data => {
                this.markers = data.markers;
                if(this.spec.centerlat === undefined || this.spec.centerlng === undefined) {
                    this.center = data.center;
                } else {
                    this.center = {
                        lng: this.spec.centerlng,
                        lat: this.spec.centerlat
                    }
                }
            }));
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {

        const container = document.createElement("div");
        container.classList.add("lto-map");
        if(this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => container.classList.add(e));
        }
        if(isNested) { container.classList.add("lto-nested") }
        container.setAttribute("name", this.spec.name || "");

        GoogleMapsLoader.LANGUAGE = "de";
        GoogleMapsLoader.KEY = "AIzaSyDBWbYLJkXygR90IoTTjbFOC832thRCAyQ";

        setTimeout(() => {
            GoogleMapsLoader.load((google: GoogleMapsLoader.google) => {
                const map = new google.maps.Map(document.getElementsByClassName("lto-map").item(0), {
                    center: this.center,
                    zoom: 12,
                    minZoom: 7,
                    maxZoom: 14,
                    streetViewControl: false,
                });

                const ICON_ACTIVE = {
                    url: 'http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png',
                    scaledSize: new google.maps.Size(30,30)
                };
                const ICON_INACTIVE = {
                    url: "https://cdn2.iconfinder.com/data/icons/basic-ict-line-icons/100/30-512.png",
                    scaledSize: new google.maps.Size(30,30)
                };
                const ICON_SELECTED = {
                    url: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                    scaledSize: new google.maps.Size(30,30)
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
                            position: marker[0].position,
                            map: map,
                            icon: marker[0].active ? ICON_ACTIVE : ICON_INACTIVE,
                        });

                        m.set("meta", marker[0].meta);
                        _markers.push([m, marker[0].active])
                    });

                    if(this.spec.exact) {
                        let selectedMarker: google.maps.Marker;
                        _markers.forEach(marker => {
                            if(marker[1]) { // is active?
                                marker[0].addListener("click", () => {
                                    if(selectedMarker !== undefined) { selectedMarker.setIcon(ICON_ACTIVE) }
                                    setValueToContainer({position: marker[0].getPosition(), meta: marker[0].get("meta")});
                                    marker[0].setIcon(ICON_SELECTED);
                                    selectedMarker = marker[0];
                                })
                            }
                        })
                    } else {
                        map.addListener("center_changed", () => {
                            drawCircle();
                            const markersInCircle: {markers: any} = {markers: []};
                            _markers.forEach(marker => {
                                if(marker[1]) {
                                    if(circle.getBounds().contains(marker[0].getPosition())) {
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
                            setValueToContainer(markersInCircle);
                        });
                    }
                } else {
                    if(this.spec.exact) {
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
                        })
                    }
                }

                function setValueToContainer(value: object) {
                    container.setAttribute("value", JSON.stringify(value));
                }

                function drawCircle() {
                    circle.setCenter(map.getCenter());
                    circle.setMap(map);
                }
            });
        }, 500);

        return container;
    }

}
