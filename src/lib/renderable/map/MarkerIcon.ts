interface IMarkerIcon {
    url: string
    size?: google.maps.Size
    scaledSize?: google.maps.Size
}

export class MarkerIcon implements IMarkerIcon {
    url: string;
    size?: google.maps.Size;
    scaledSize?: google.maps.Size;

    constructor(url: string, size?: google.maps.Size, scaledSize?: google.maps.Size){
        this.url=url;
        this.size=size;
        this.scaledSize=scaledSize;
    }
}
