import {Gaia} from './lib/Gaia';
import {ClassicRenderer} from './lib/renderer/ClassicRenderer';
import {ContentCentricRenderer} from './lib/renderer/ContentCentricRenderer';
import {MouseBehaviour} from './lib/behaviour/MouseBehaviour';
import {KeyboardBehaviour} from './lib/behaviour/KeyboardBehaviour';
import {ChannelType} from './lib/support/ChannelType';
import {OffSwitchListener} from './lib/listener/OffSwitchListener';
import {Defaults} from './lib/support/Defaults';
import './styles.scss';
// export default Gaia class
export default {
    ClassicRenderer,
    ContentCentricRenderer,
    Gaia,
    MouseBehaviour,
    KeyboardBehaviour,
    ChannelType,
    OffSwitchListener,
    Defaults
};
