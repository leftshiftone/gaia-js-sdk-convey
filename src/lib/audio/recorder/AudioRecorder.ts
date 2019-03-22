/**
 * @author benjamin.krenn@leftshift.one - 3/11/19.
 * @since 0.1.0
 */
export interface AudioRecorder {
    startRecording(): Promise<void>;

    stopRecording(): Promise<string>;
}
