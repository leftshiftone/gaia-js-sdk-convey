/**
 * This interface is used to specify an incoming message
 */
export interface ISpecification {
    type: string;
    elements?: ISpecification[];
    position?: "left" | "right";
    text?: string;
    name?: string;
    id?: string;
    class?: string;
    value?: string;
    source?: string;
    width?: string;
    height?: string;
    timestamp?: string;
    min?: string;
    max?: string;
    size?: string;
    step?: string;
    src?: string;
    horizontal?: string;
    exact?: boolean;
    checked?: string;
    mapType?: string;
    valueType?: string;
    centerLat?: number;
    centerLng?: number;
    required?: boolean;
    regex?: string;
    placeholder?: string;
    centerBrowserLocation?: boolean;
    nerStrategies?: Map<string, any>;
    accept?: string;
    maxSize?: number;
    countdownInSec?: number;
    values?: Array<string>;
    sieve?: boolean;
    selected?: boolean;
    format?: "qr" | "bar";
    rows?: number;
    cols?: number;
    maxCompressSize?: number;
    trigger?: string;
    wrapped?: string;
    direction?: string;
    markerIcon?: string;
    selectedMarkerIcon?: string;
    ordered?: boolean;
    maxSelections?: number;
}
