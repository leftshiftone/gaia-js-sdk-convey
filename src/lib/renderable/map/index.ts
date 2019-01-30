import * as L from 'leaflet';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import './leaflet.css';
import Renderables from "../Renderables";
import {Marker} from "leaflet";

export class Map implements IRenderable {

    public map: any;
    public markers: Array<[number, number]> = [[0,0]];
    public center: [number, number] = [0,0];
    public zoom: number;
    public leafletSettings: any;
    public circle: any;
    public numMarkers: number = 0;
    public mapMarkers: any;
    public mapMarkerActiveUrl: string;
    public mapMarkerInactiveUrl: string;
    public mapMarkerActive: any;
    public mapMarkerInactive: any;
    public mapContainer: any;
    public spec: ISpecification

    constructor(spec: any) {
        this.zoom = 13;
        this.leafletSettings = {
            minZoom: 10,
            maxZoom: 14,
        };
        this.spec = spec;
        this.mapMarkerActiveUrl = spec.mapMarkerActiveUrl;
        this.mapMarkerInactiveUrl = spec.mapMarkerInactiveUrl;

        this.getJSON(spec.src);

    }

    public getJSON(src: string) {
        fetch(src).then(response =>
            response.json().then(data => {
                this.markers = data.markers;
                this.center = data.center;
            }));
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
                    Map.distance(
                        bounds.getNorthEast().lat,
                        bounds.getNorthEast().lng,
                        bounds.getSouthEast().lat,
                        bounds.getSouthEast().lng,
                    ) / 2.15,
                    Map.distance(
                        bounds.getNorthEast().lat,
                        bounds.getNorthEast().lng,
                        bounds.getNorthWest().lat,
                        bounds.getNorthWest().lng,
                    ) / 2.15,
                ),
                2000,
            ),
            20000,
        );
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
        this.numMarkers = 0;

        const selected: Array<any> = [];
        this.mapMarkers.forEach((m: any) => {
            const mpos = m.getLatLng();
            const dist = Map.distance(mpos.lat, mpos.lng, position.lat, position.lng) / 1.05;
            if (dist <= radius) {
                selected.push(m);
                m.setIcon(this.mapMarkerActive);
            } else {
                m.setIcon(this.mapMarkerInactive);
            }
        });

        this.mapContainer.value = selected;
    }


    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        this.mapContainer = document.createElement('div');
        this.mapContainer.classList.add('lto-map');
        this.mapContainer.name = this.spec.name;

        const countMarkers = document.createElement('span');
        countMarkers.classList.add('num-markers');

        const noMarkers = document.createElement('div');
        noMarkers.classList.add('no-markers');

        this.mapContainer.appendChild(countMarkers);
        this.mapContainer.appendChild(noMarkers);
        if(isNested) {
            this.mapContainer.classList.add("lto-nested");
        }

        setTimeout(() => {
            const osmUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
            const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
            const osm = new L.TileLayer(osmUrl, {subdomains: ['a', 'b', 'c'], attribution: osmAttrib});
            this.map = L.map(this.mapContainer, this.leafletSettings).setView(this.center, this.zoom);
            this.map.addLayer(osm);
            this.mapMarkerActive = L.icon({
                iconUrl: 'http://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-Free-Download-PNG.png',
            });
            this.mapMarkerInactive = L.icon({
                iconUrl: 'https://cdn2.iconfinder.com/data/icons/navigation-location/512/Gps_locate_location_map_marker_navigate_navigation_pin_plan_road_route_travel_icon_-512.png',
            });

            const mapMarkerSelected = L.icon({
                iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png'
            });

            let selected: Marker | null = null;

            this.mapMarkers = [];
            if(this.markers !== undefined) {
                this.markers.forEach((data: any) => {
                    data.forEach((m:any) => {
                        const marker = L.marker(m.position, {icon: m.active ? this.mapMarkerActive : this.mapMarkerInactive, alt: m.meta !== undefined ? m.meta : {}});
                        if(this.spec.exact) {
                            if(m.active) {
                                marker.on("click", () => {
                                    if(selected !== null) {
                                        selected.setIcon(this.mapMarkerActive);
                                    }
                                    selected = marker;
                                    marker.setIcon(mapMarkerSelected);
                                    this.mapContainer.value = marker;
                                })
                            }
                        }
                        this.mapMarkers.push(marker);
                        marker.addTo(this.map);
                    })

                });
            }

            if(this.spec.exact === false) {
                this.drawCircleAndMarkers();
                this.map.addEventListener('moveend', this.drawCircleAndMarkers.bind(this));
            }


        }, 500);

        if (this.spec.class !== undefined) this.mapContainer.classList.add(this.spec.class);

        return this.mapContainer;
    }

}

Renderables.register("map", Map);
