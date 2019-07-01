
export function drawCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement, mediaStream: MediaStream, maxCanvasSize: number) {
    const videoTrackSettings = mediaStream!.getVideoTracks()[0].getSettings();
    const cameraWidth = videoTrackSettings.width!;
    const cameraHeight = videoTrackSettings.height!;

    sizeCanvasAccordingToImage(canvas, cameraWidth, cameraHeight, maxCanvasSize);

    const ratio = Math.min(canvas.width / cameraWidth, canvas.height / cameraHeight);
    const scaledWidth = cameraWidth * ratio;
    const scaledHeight = cameraHeight * ratio;

    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext("2d")!.drawImage(video, 0, 0, cameraWidth, cameraHeight, x, y, scaledWidth, scaledHeight);
}

function sizeCanvasAccordingToImage(canvas: HTMLCanvasElement, width: number, height: number, maxCanvasSize: number) {
    let isLandscape = width > height;
    const imageRatio = width / height;
    if (isLandscape && width > maxCanvasSize) {
        canvas.width = maxCanvasSize;
        canvas.height = maxCanvasSize / imageRatio;
    } else if (!isLandscape && height > maxCanvasSize) {
        canvas.width = maxCanvasSize * imageRatio;
        canvas.height = maxCanvasSize
    } else {
        canvas.width = width;
        canvas.height = height;
    }
}
