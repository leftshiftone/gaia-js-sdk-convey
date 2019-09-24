import {MqttConnection} from '../connection/MqttConnection';

/**
 * Classes which implement this interface can bind
 * specific control elements to publish messages
 */
export interface IBehaviour {

    /**
     *
     * @param gateway the {@link MqttConnection}
     */
    bind(gateway:MqttConnection):void;

}
