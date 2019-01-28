export default class Renderables {

    private static renderableMap = {};

    public static register(name: string, renderable: any) {
        this.renderableMap[name.toUpperCase()] = renderable;
    }

export const renderables: object = {
    BREAK: Break,
    BLOCK: Block,
    BOLD: Bold,
    BUTTON: Button,
    CHECKBOX: Checkbox,
    COL: Col,
    HEADLINE: Headline,
    IMAGE: Image,
    ITEM: Item,
    ITEMS: Items,
    LINK: Link,
    MAP: Map,
    ROW: Row,
    SUBMIT: Submit,
    TABLE: Table,
    TEXT: Text,
    CAROUSEL: Carousel,
    CONTAINER: Container,
    SUGGESTION: Suggestion,
    SLIDER: Slider,
    SPINNER: Spinner,
    CALENDAR: Calendar,
    SLOTMACHINE: SlotMachine,
    REEL: Reel,
    DATEPICKER: DatePicker,
    DATETIMEPICKER: DateTimePicker,
};
