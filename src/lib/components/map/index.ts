import { MarkupComponent } from '../markup-component';
import * as L from 'leaflet';

export class Map extends MarkupComponent {

    public map: any;
    public markers: any;
    public center: number[];
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

    constructor(message: any) {
        super('map');
        this.markers = message.markers;
        this.center = message.center;
        this.zoom = message.zoom;
        this.leafletSettings = {
            minZoom: message.minZoom,
            maxZoom: message.maxZoom,
        };
        this.mapMarkerActiveUrl = message.mapMarkerActiveUrl;
        this.mapMarkerInactiveUrl = message.mapMarkerInactiveUrl;
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
            this.circle = L.circle([position.lat, position.lng], { radius });
            this.circle.addTo(this.map);
        } else {
            this.circle.setLatLng(position);
            this.circle.setRadius(radius);
        }
        this.numMarkers = 0;
        this.mapMarkers.forEach((m: any) => {
            const mpos = m.getLatLng();
            const dist = Map.distance(mpos.lat, mpos.lng, position.lat, position.lng) / 1.05;
            if (dist <= radius) {
                m.setIcon(this.mapMarkerActive);
                this.numMarkers += 1;
            } else {
                m.setIcon(this.mapMarkerInactive);
            }
        });

   //  const gaiaButtonElem = <HTMLElement>document.querySelector('.gaia-button-nested');
   //  const noMarkersElem = <HTMLElement>document.querySelector('.no-markers');
//
   //  if (this.numMarkers > 0) {
   //      const numMarkersElem = <HTMLElement>document.querySelector('.num-markers');
   //      if (numMarkersElem && gaiaButtonElem && noMarkersElem) {
   //          numMarkersElem.innerHTML = String(this.numMarkers);
   //          gaiaButtonElem.style.display = 'inherit';
   //          noMarkersElem.style.display = 'None';
   //      }
   //  } else {
   //      gaiaButtonElem.style.display = 'None';
   //      noMarkersElem.style.display = 'inherit';
   //  }
    }


    public render(container: any, sendMessage: any) {
        this.mapContainer = document.createElement('div');
        this.mapContainer.classList.add('map');

        const countMarkers = document.createElement('span');
        countMarkers.classList.add('num-markers');

        const noMarkers = document.createElement('div');
        noMarkers.classList.add('no-markers');

        this.mapContainer.appendChild(countMarkers);
        this.mapContainer.appendChild(noMarkers);

        container.appendChild(this.mapContainer);

        setTimeout(() => {
            const osmUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
            const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
            const osm = new L.TileLayer(osmUrl, { subdomains: ['a', 'b', 'c'], attribution: osmAttrib });
            this.map = L.map(this.mapContainer, this.leafletSettings);
            this.map.setView(this.center, this.zoom);
            this.map.addLayer(osm);
            this.mapMarkerActive = L.icon({
                iconUrl: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png',
            });
            this.mapMarkerInactive = L.icon({
                iconUrl: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png',
            });
            this.mapMarkers = [];
            this.markers.forEach((m: any) => {
                const marker = L.marker(m, { icon: this.mapMarkerInactive });
                marker.addTo(this.map);
                this.mapMarkers.push(marker);
            });
            this.drawCircleAndMarkers();
            this.map.addEventListener('moveend', this.drawCircleAndMarkers.bind(this));
        },         500);
    }
}
