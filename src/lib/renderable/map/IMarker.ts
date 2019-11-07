export interface IMarker {
    position: {
        lat: number
        lng: number
    }
    meta?: Map<string, any>
    label?: string
    active: boolean
}
