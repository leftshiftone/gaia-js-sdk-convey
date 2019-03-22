/**
 * IBehaviour implementation that listens for a onmouseup/down on the given recordButton.
 *
 * onmouseup starts the recording, onmousedown stops the recording and publishes an audio message
 * to the outbound audio channel.
 *
 * @author benjamin.krenn@leftshift.one - 3/11/19.
 * @since 0.7.0
 */
import {IBehaviour} from "../api/IBehaviour";
import {MqttConnection} from "../connection/MqttConnection";
import {AudioRecorder} from "../audio/recorder/AudioRecorder";
import {WebRTCRecorder} from "../audio/recorder/WebRTCRecorder";
import {ChannelType} from "../support/ChannelType";
import {ISpecification} from "../api/IRenderer";
import {BufferedAudioPlayer} from "../audio/player/BufferedAudioPlayer";

export class VoiceBehaviour implements IBehaviour {

    private readonly recordButton: HTMLButtonElement;
    private readonly recorder: AudioRecorder;
    private readonly callback: (eventType: EventType) => void;

    constructor(recordButton: HTMLButtonElement,
                recorder: AudioRecorder = WebRTCRecorder.instance(),
                callback: (eventType: EventType) => void = () => undefined) {
        this.recordButton = recordButton;
        this.recorder = recorder;
        this.callback = callback;
    }

    public bind(gateway: MqttConnection): void {
        this.subscribeToAudioChannel(gateway);
        this.startRecordingOnMouseDown();
        this.stopRecordingOnMouseUp(gateway);
    }

    /**
     * Binds {@link AudioRecorder#startRecording} to {@link this#recordButton} when an "mousedown" event occurs
     */
    private startRecordingOnMouseDown(): void {
        this.recordButton.addEventListener(EventType.ON_MOUSE_DOWN, () => {
            this.recorder.startRecording();
            this.callback(EventType.ON_MOUSE_DOWN);
        });
    }

    /**
     * Binds {@link AudioRecorder#stopRecording} to {@link this#recordButton} when an "mouseup" event occurs
     */

    private stopRecordingOnMouseUp(gateway: MqttConnection): void {
        this.recordButton.addEventListener(EventType.ON_MOUSE_UP, () => {
            this.recorder.stopRecording().then(result => {
                gateway.publish(ChannelType.AUDIO, {type: "text", text: result} as ISpecification);
            });
        });
    }

    /**
     * Subscribes to the audio channel. Callback has no effect since message types are handled by {@link MqttConnection#onMessage}
     * @param gateway
     */
    private subscribeToAudioChannel(gateway: MqttConnection): void {
        gateway.subscribe(ChannelType.AUDIO, (msg: any) => {
            BufferedAudioPlayer.instance().play(msg);
        });
    }
}

enum EventType {
    ON_MOUSE_DOWN = "mousedown",
    ON_MOUSE_UP = "mouseup"
}
