import {MqttConnection} from '../connection/MqttConnection';

export interface IBehaviour {

    bind(gateway:MqttConnection):void;

}
