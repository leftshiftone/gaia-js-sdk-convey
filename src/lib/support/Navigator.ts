
export function getUserVideoMedia() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia({video: true})
    } else {
        return null;
    }
}
