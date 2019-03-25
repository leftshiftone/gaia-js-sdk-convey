/**
 * @author benjamin.krenn@leftshift.one - 3/14/19.
 * @since 0.12.0
 */
import {AudioPlayer} from "./AudioPlayer";
import {MutableQueue} from "./queue/MutableQueue";
import {Base64ToArrayBufferConverter} from "./Base64ToArrayBufferConverter";

/**
 * Plays an audio representation of a given message by converting the base64 payload (wav) to an ArrayBuffer
 * and then feeding this ArrayBuffer into the Web Audio API.
 *
 * To keep it simple this implementation makes the rather naive assumption that all messages that should be played
 * will be added to the queue before playing the first (initial) message is done.
 * This assumption is made to avoid complex Promise heavy code and/or a while loop that may completely block
 * the front-end.
 *
 *
 * @author benjamin.krenn@leftshift.one
 * @since 0.12.0
 */
export class BufferedAudioPlayer implements AudioPlayer {

    /**
     * Singleton to prevent the existence of multiple audio players and therefore overlapping.
     * @returns {AudioPlayer}
     */
    public static instance() : AudioPlayer {
        return this.INSTANCE || (this.INSTANCE = new this())
    }

    private static INSTANCE: BufferedAudioPlayer;

    private readonly queue = new MutableQueue<any>();
    private readonly audioContext = new AudioContext();
    private state = State.READY;


    /**
     * Adds a message to the Queue and starts playing queued messages.
     * @param {Map<string, string>} message
     */
    public play(message: any): void {
        this.queue.enqueue(message);
        this.playAudio();
    }

    private playAudio(): void {
        if (this.state === State.READY) {
            this.state = State.PLAYING;
            const source = this.audioContext.createBufferSource();
            this.audioContext.decodeAudioData(
                Base64ToArrayBufferConverter.base64ToArrayBuffer(this.queue.dequeue()["base64audio"]))
                .then(data => {
                    source.buffer = data;
                    source.connect(this.audioContext.destination);
                    source.onended = () => {
                        this.state = State.READY;
                        if (!this.queue.isEmpty()) {
                            this.playAudio();
                        }
                    };
                    source.start(0);
                });
        }
    }

}
 enum State {
    PLAYING,
    READY
}
