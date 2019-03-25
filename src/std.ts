import {Gaia} from './lib/Gaia';
import {ClassicRenderer} from './lib/renderer/ClassicRenderer';
import {ContentCentricRenderer} from './lib/renderer/ContentCentricRenderer';
import {MouseBehaviour} from './lib/behaviour/MouseBehaviour';
import {KeyboardBehaviour} from './lib/behaviour/KeyboardBehaviour';
import {ChannelType} from './lib/support/ChannelType';
import {OffSwitchListener} from './lib/listener/OffSwitchListener';
import {Defaults} from './lib/support/Defaults';
import {Block} from './lib/renderable/block';
import {Camera} from "./lib/renderable/camera";
import {Swipe} from './lib/renderable/swipe';
import {Bold} from './lib/renderable/bold';
import {Break} from './lib/renderable/break';
import {Button} from './lib/renderable/button';
import {Calendar} from './lib/renderable/calendar';
import {Carousel} from './lib/renderable/carousel';
import {Checkbox} from './lib/renderable/checkbox';
import {Container} from './lib/renderable/container';
import {Headline} from './lib/renderable/headline';
import {Image} from './lib/renderable/image';
import {Item} from './lib/renderable/item';
import {Items} from './lib/renderable/items';
import {Link} from './lib/renderable/link';
import {Reel} from './lib/renderable/reel';
import {Upload} from './lib/renderable/upload';
import {Slider} from './lib/renderable/slider';
import {SlotMachine} from './lib/renderable/slotmachine';
import {Spinner} from './lib/renderable/spinner';
import {Form} from "./lib/renderable/form";
import {Email} from "./lib/renderable/email";
import {Phone} from "./lib/renderable/phone";
import {TextInput} from "./lib/renderable/textInput";
import {Submit} from './lib/renderable/submit';
import {Suggestion} from './lib/renderable/suggestion';
import {Table} from './lib/renderable/table';
import {Col} from "./lib/renderable/table/col";
import {Row} from "./lib/renderable/table/row";
import {ReelValue} from "./lib/renderable/reelValue";
import {Text} from './lib/renderable/text';
import {Heatmap} from './lib/renderable/vis/heatmap/Heatmap';
import {Sunburst} from './lib/renderable/vis/sunburst/Sunburst';
import {Sankey} from './lib/renderable/vis/sankey/Sankey';
import Scatterplot from './lib/renderable/vis/scatterplot/Scatterplot';
import Stackedbar from './lib/renderable/vis/stackedbar/Stackedbar';
import Renderables from "./lib/renderable/Renderables";
import Properties from "./lib/renderable/Properties";
import EventStream from "./lib/event/EventStream";

if (typeof document !== "undefined") {
    require("./lib/styles.scss");

    require("./lib/renderable/bold/style.scss");
    require("./lib/renderable/block/style.scss");
    require("./lib/renderable/button/style.scss");
    require("./lib/renderable/carousel/style.scss");
    require("./lib/renderable/calendar/style.scss");
    require("./lib/renderable/camera/style.scss");
    require("./lib/renderable/checkbox/style.scss");
    require("./lib/renderable/form/style.scss");
    require("./lib/renderable/icon/style.scss");
    require("./lib/renderable/image/style.scss");
    require("./lib/renderable/items/style.scss");
    require("./lib/renderable/link/style.scss");
    require("./lib/renderable/reelValue/style.scss");
    require("./lib/renderable/reel/style.scss");
    require("./lib/renderable/submit/style.scss");
    require("./lib/renderable/swipe/style.scss");
    require("./lib/renderable/slider/style.scss");
    require("./lib/renderable/slotmachine/style.scss");
    require("./lib/renderable/suggestion/style.scss");
    require("./lib/renderable/text/style.scss");
    require("./lib/renderable/table/style.scss");
    require("./lib/renderable/timestamp/style.scss");
    require("./lib/renderable/upload/style.scss");
}

// export default Gaia class
export {
    ClassicRenderer,
    ContentCentricRenderer,
    Gaia,
    MouseBehaviour,
    KeyboardBehaviour,
    ChannelType,
    OffSwitchListener,
    Defaults,
    Renderables,
    Properties,
    EventStream,
    Block,
    Bold,
    Break,
    Button,
    Calendar,
    Upload,
    Carousel,
    Checkbox,
    Container,
    Headline,
    Image,
    Item,
    Items,
    Form,
    Email,
    Camera,
    TextInput,
    Phone,
    Link,
    Reel,
    Slider,
    SlotMachine,
    Spinner,
    Submit,
    Suggestion,
    Table,
    Text,
    Row,
    Col,
    Swipe,
    ReelValue,

    Heatmap,
    Sunburst,
    Sankey,
    Scatterplot,
    Stackedbar
};
