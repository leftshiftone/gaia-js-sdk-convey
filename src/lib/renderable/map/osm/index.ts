import * as L from 'leaflet';
import {Circle, Icon, LatLngLiteral, Marker} from 'leaflet';
import {IRenderable, IRenderer, ISpecification} from '../../../api';
import {IMarker} from "../IMarker";

export class OpenStreetMap implements IRenderable {

    public map: any;
    public markers: Array<IMarker> = [];
    public center: LatLngLiteral;
    public circle: Circle | null;
    public mapMarkers: Array<Marker>;
    public mapMarkerActive: Icon;
    public mapMarkerInactive: Icon;
    public mapContainer: HTMLDivElement;
    public spec: ISpecification;
    private readonly osmMinZoom: number = 2;
    private readonly osmMaxZoom: number = 14;
    private readonly osmDefaultzoom: number = 8;

    constructor(spec: ISpecification) {
        this.spec = spec;
        this.mapContainer = document.createElement('div');
        this.mapMarkerActive = L.icon({
            iconUrl: 'https://img.icons8.com/office/96/000000/marker.png',
        });
        this.mapMarkerInactive = L.icon({
            iconUrl: 'https://img.icons8.com/ultraviolet/96/000000/marker.png',
        });
        this.center = {lng: 0, lat: 0};
        this.mapMarkers = [];
        this.circle = null;
        const src = spec.src || "";
        this.getMarkersAndCenter(src);
    }

    public getMarkersAndCenter(src: string | undefined) {
        if (src !== undefined) {
            fetch(src).then(response =>
                response.json().then(data => {
                    this.markers = data.markers;
                    if (this.spec.centerLat !== undefined && this.spec.centerLng !== undefined) {
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
            if (this.spec.centerLat !== undefined && this.spec.centerLng !== undefined) {
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

    public static distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = (
            Math.sin(radlat1) *
            Math.sin(radlat2) +
            Math.cos(radlat1) *
            Math.cos(radlat2) *
            Math.cos(radtheta)
        );
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        return dist * 1.609344 * 1000;
    }

    public getRadius(): number {
        const bounds = this.map.getBounds();
        return Math.min(
            Math.max(
                Math.min(
                    OpenStreetMap.distance(
                        bounds.getNorthEast().lat,
                        bounds.getNorthEast().lng,
                        bounds.getSouthEast().lat,
                        bounds.getSouthEast().lng,
                    ) / 2.15,
                    OpenStreetMap.distance(
                        bounds.getNorthEast().lat,
                        bounds.getNorthEast().lng,
                        bounds.getNorthWest().lat,
                        bounds.getNorthWest().lng,
                    ) / 2.15), 2000), 20000);
    }

    public drawCircle() {
        const position = this.map.getCenter();
        const radius = this.getRadius();
        if (!this.circle) {
            this.circle = L.circle([position.lat, position.lng], {radius});
            this.circle.addTo(this.map);
        } else {
            this.circle.setLatLng(position);
            this.circle.setRadius(radius);
        }

        this.mapContainer.setAttribute("data-value", JSON.stringify({position: this.circle!.getBounds().getCenter()}));
    }

    public drawCircleAndMarkers() {
        const position = this.map.getCenter();
        const radius = this.getRadius();
        if (!this.circle) {
            this.circle = L.circle([position.lat, position.lng], {radius});
            this.circle.addTo(this.map);
        } else {
            this.circle.setLatLng(position);
            this.circle.setRadius(radius);
        }

        const selected: Array<any> = [];
        this.mapMarkers.forEach((m: Marker) => {
            const mpos = m.getLatLng();
            const dist = OpenStreetMap.distance(mpos.lat, mpos.lng, position.lat, position.lng) / 1.05;
            if (dist <= radius) {
                selected.push(m);
                m.setIcon(this.mapMarkerActive);
            } else {
                m.setIcon(this.mapMarkerInactive);
            }
        });

        let markers: Array<any> = [];
        selected.forEach(m => {
            markers.push(OpenStreetMap.getMarkerJSON(m));
        });

        this.mapContainer.setAttribute("data-value", JSON.stringify({markers: markers}));
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        this.mapContainer.classList.add('lto-map');
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => this.mapContainer.classList.add(e));
        }
        this.mapContainer.setAttribute("name", this.spec.name || "lto-map");

        const countMarkers = document.createElement('span');
        countMarkers.classList.add('num-markers');

        const noMarkers = document.createElement('div');
        noMarkers.classList.add('no-markers');

        this.mapContainer.appendChild(countMarkers);
        this.mapContainer.appendChild(noMarkers);

        if (isNested) {
            this.mapContainer.classList.add("lto-nested");
        }

        setTimeout(() => {
            const leafletSettings = {minZoom: this.osmMinZoom, maxZoom: this.osmMaxZoom};

            const osmUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
            const osmAttrib = 'OpenStreetMap data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

            const osm = L.tileLayer(osmUrl, {subdomains: ['a', 'b', 'c'], attribution: osmAttrib});
            this.map = L.map(this.mapContainer, leafletSettings).setView(this.center, this.getZoom());
            this.map.addLayer(osm);

            const mapMarkerSelected = L.icon({
                iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png'
            });

            let selected: Marker | null = null;

            if (this.markers !== undefined) {
                this.markers.forEach((m: any) => {
                    const marker = L.marker(m.position, {
                        icon: m.active ? this.mapMarkerActive : this.mapMarkerInactive,
                        alt: m.meta !== undefined ? m.meta : {}
                    });
                    if (this.spec.exact) {
                        if (m.active) {
                            marker.on("click", () => {
                                if (selected !== null) {
                                    selected.setIcon(this.mapMarkerActive);
                                }
                                selected = marker;
                                marker.setIcon(mapMarkerSelected);
                                this.mapContainer.setAttribute("data-value", JSON.stringify(OpenStreetMap.getMarkerJSON(marker)));
                            })
                        }
                    }
                    this.mapMarkers.push(marker);
                    marker.addTo(this.map);
                });
                if (this.spec.exact === false) {
                    this.drawCircleAndMarkers();
                    this.map.addEventListener('moveend', this.drawCircleAndMarkers.bind(this));
                }
            } else {
                this.drawCircle();
                this.map.addEventListener('moveend', this.drawCircle.bind(this));
            }


        }, 500);

        if (this.spec.class !== undefined) this.mapContainer.classList.add(this.spec.class);

        return this.mapContainer;
    }

    private getZoom(): number {
        if (this.spec.zoom && this.spec.zoom >= this.osmMinZoom && this.spec.zoom <= this.osmMaxZoom) {
            return this.spec.zoom;
        } else if (this.spec.zoom && this.spec.zoom > this.osmMaxZoom) {
            return this.osmMaxZoom;
        } else if (this.spec.zoom && this.spec.zoom < this.osmMinZoom) {
            return this.osmMinZoom;
        }
        return this.osmDefaultzoom;
    }

    public static getMarkerJSON(marker: Marker) {
        return {
            position: {
                lat: marker.getLatLng().lat,
                lng: marker.getLatLng().lng,
            },
            meta: marker.options.alt
        }
    }

}
