import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import {CalendarEvent} from "./calendar-event";

/**
 * Implementation of the 'datePicker' markup element.
 */
export class DatePicker implements IRenderable {
    private readonly freeEventTitle = "Freier Termin";
    private readonly defaultSize = '7';
    private readonly locale = 'de-DE';

    private readonly events: CalendarEvent[];
    private readonly size: number;
    private readonly message: ISpecification;
    private _currentStartDate: Date;

    private readonly datePicker: HTMLDivElement;
    private readonly dayButtonContainer: HTMLDivElement;
    private readonly headline: HTMLDivElement;
    private readonly nextButton: HTMLButtonElement;
    private readonly previousButton: HTMLButtonElement;
    private readonly input: HTMLDivElement;

    constructor(message: ISpecification) {
        const ical = require("node-ical");
        const icalObject = ical.parseICS(message.src);
        this.events = Object.keys(icalObject)
            .filter(key => icalObject[key]['summary'] === this.freeEventTitle)
            .map(key =>
                new CalendarEvent(icalObject[key]['start'], icalObject[key]['end'], icalObject[key]['uid'])
            );


        this.message = message;
        this.size = parseInt(message.size || this.defaultSize);
        this._currentStartDate = new Date();
        this.headline = this.renderHeadline();
        this.datePicker = document.createElement('div');
        this.dayButtonContainer = document.createElement('div');

        this.nextButton = this.renderNext();
        this.previousButton = this.renderPrevious();
        this.input = this.renderInput();
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const datePickerContainer = document.createElement('div');
        const position = this.message.position || 'left';

        if (isNested) {
            datePickerContainer.classList.add("lto-nested");
        }
        datePickerContainer.classList.add("lto-date-picker-container", "lto-" + position);


        this.datePicker.classList.add("date-picker");
        this.dayButtonContainer.classList.add("days-container");

        this.datePicker.appendChild(this.renderHeader());
        this.datePicker.appendChild(this.previousButton);
        this.datePicker.appendChild(this.dayButtonContainer);
        this.datePicker.appendChild(this.nextButton);
        this.datePicker.appendChild(this.input);
        this.updateDayButtons();

        datePickerContainer.appendChild(this.datePicker);
        return datePickerContainer;
    }

    private renderPrevious(): HTMLButtonElement {
        const previous = document.createElement('button');
        previous.classList.add("previous");
        previous.innerText = "<";
        previous.onclick = () => this.previous();
        return previous;
    }

    private renderNext(): HTMLButtonElement {
        const next = document.createElement('button');
        next.classList.add("next");
        next.innerText = ">";
        next.onclick = () => this.next();
        return next;
    }

    private renderInput(): HTMLDivElement {
        const input = document.createElement('div');
        input.classList.add("input");
        input.textContent = "Select a day";
        return input;
    }

    private getDatesToRender(): Date[] {
        const datesToRender = [this.currentStartDate];
        for (let i = 1; i < this.size; i++) {
            datesToRender.push(CalendarEvent.addDays(this.currentStartDate, i));
        }
        return datesToRender;
    }

    private renderDayButtons(): HTMLDivElement[] {
        const dates = this.getDatesToRender();
        const relevantEvents = this.getRelevantEvents();
        return dates.map(date => {
            const weekDay = date.toLocaleDateString(this.locale, {weekday: 'short'});
            const abbreviatedDate = date.toLocaleDateString(this.locale, {day: 'numeric', month: 'short'});
            const event = relevantEvents.find((event: CalendarEvent) => event.isDateInEventRange(date));
            return this.renderDayButton(weekDay, abbreviatedDate, event);
        });
    }


    private getRelevantEvents(): CalendarEvent[] {
        return this.events.filter(event =>
            event.isEventInDateRange(this.currentStartDate, CalendarEvent.addDays(this.currentStartDate, this.size))
        );
    }

    public renderHeadline(): HTMLDivElement {
        const headline = document.createElement('div');
        headline.classList.add('headline');
        return headline;
    }

    public renderDayButton(weekDay: string, abbreviatedDate: string, event: CalendarEvent | undefined): HTMLDivElement {
        const input = document.createElement('div');
        input.classList.add('day');
        input.classList.add(event ? 'free' : 'taken');

        const weekDayContainer = document.createElement('div');
        weekDayContainer.textContent = weekDay;
        weekDayContainer.classList.add('weekday');

        const abbreviatedDateContainer = document.createElement('div');
        abbreviatedDateContainer.textContent = abbreviatedDate;
        abbreviatedDateContainer.classList.add('abbreviated-date');

        input.appendChild(weekDayContainer);
        input.appendChild(abbreviatedDateContainer);
        if (event) {
            const uid = event.uid;
            input.onclick = () => {
                this.input.setAttribute("value", uid);
                this.input.textContent = weekDay + ", " + abbreviatedDate;
            };

        }
        return input;
    }

    public renderHeader(): HTMLDivElement {
        const header = document.createElement("div");
        header.appendChild(this.headline);
        return header;
    }

    public updateDayButtons(): void {
        this.dayButtonContainer.innerHTML = "";
        this.renderDayButtons().forEach(button => this.dayButtonContainer.appendChild(button));
    }

    public next() {
        this.currentStartDate = CalendarEvent.addDays(this.currentStartDate, this.size);
        this.updateDayButtons();
    }

    public previous() {
        this.currentStartDate = CalendarEvent.addDays(this.currentStartDate, -this.size);
        this.updateDayButtons();
    }

    set currentStartDate(date: Date) {
        const currentDate = CalendarEvent.withoutTime(new Date());
        if (currentDate > date) {
            this._currentStartDate = currentDate;
        } else {
            this._currentStartDate = date;
        }
    }

    get currentStartDate() {
        return this._currentStartDate;
    }
}
