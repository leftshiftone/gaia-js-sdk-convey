export interface IMarker {
    position: {
        lat: number
        lng: number
    }
    meta?: object
    active: boolean
}
