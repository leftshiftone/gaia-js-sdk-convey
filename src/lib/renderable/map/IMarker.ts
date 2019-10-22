export interface IMarker {
    position: {
        lat: number
        lng: number
    }
    meta?: object
    label?: string
    active: boolean
}
