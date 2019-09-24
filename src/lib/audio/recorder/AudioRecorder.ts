
export interface AudioRecorder {
    startRecording(): Promise<void>;

    stopRecording(): Promise<string>;
}
