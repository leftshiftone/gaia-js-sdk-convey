/**
 * Implementations provide basic audio record functionality.
 */
export interface AudioRecorder {
    /**
     * Starts an audio recording using the browser media api to receive the result of
     * a recording see: {@link AudioRecorder#stopRecording()}
     */
    startRecording(): Promise<void>;

    /**
     * Stops a running recording session and returns the recorded data as a base64 string.
     */
    stopRecording(): Promise<string>;
}
