import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import {CalendarEvent} from "./calendar-event";

/**
 * Implementation of the 'datePicker' markup element.
 */
export class DatePicker implements IRenderable {
    public readonly locale = 'de-DE';
    private readonly freeEventTitle = "Freier Termin";
    private readonly defaultSize = '7';


    protected readonly events: CalendarEvent[];
    private readonly size: number;
    private readonly message: ISpecification;
    private _currentStartDate: Date;

    public readonly input: HTMLDivElement;
    protected readonly datePicker: HTMLDivElement;
    private readonly dayButtonContainer: HTMLDivElement;
    private readonly nextButton: HTMLButtonElement;
    private readonly previousButton: HTMLButtonElement;


    constructor(message: ISpecification) {
        const ical = require("node-ical");
        console.log(message);
        const icalObject = ical.parseICS(message.src);
        this.events = Object.keys(icalObject)
            .filter(key => icalObject[key]['summary'] === this.freeEventTitle)
            .map(key =>
                new CalendarEvent(icalObject[key]['start'], icalObject[key]['end'], icalObject[key]['uid'])
            );


        this.message = message;
        this.size = parseInt(message.size || this.defaultSize);
        this._currentStartDate = new Date();

       this.datePicker = document.createElement('div');
        this.dayButtonContainer = document.createElement('div');

        this.nextButton = this.renderNext();
        this.previousButton = this.renderPrevious();
        this.input = this.renderInput();
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
    const datePickerContainer = this.renderDatePickerContainer();
        if (isNested) {
            datePickerContainer.classList.add("lto-nested");
        }

        this.datePicker.classList.add("date-picker");
        this.dayButtonContainer.classList.add("days-container");

        this.datePicker.appendChild(this.previousButton);
        this.datePicker.appendChild(this.dayButtonContainer);
        this.datePicker.appendChild(this.nextButton);
        datePickerContainer.appendChild(this.input);
        this.updateDayButtons();

        datePickerContainer.appendChild(this.datePicker);
        return datePickerContainer;
    }

    private renderDatePickerContainer(): HTMLDivElement {
        const datePickerContainer = document.createElement('div');
        const position = this.message.position || 'left';
        datePickerContainer.classList.add("lto-date-picker-container", "lto-" + position);
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
            const event = relevantEvents.find((event: CalendarEvent) => event.isDateInEventRange(date));
            return this.renderDayButton(date, event);
        });
    }


    private getRelevantEvents(): CalendarEvent[] {
        return this.events.filter(event =>
            event.isInDateRange(this.currentStartDate, CalendarEvent.addDays(this.currentStartDate, this.size))
        );
    }

    public renderWeekDay(date: Date): HTMLDivElement {
        const weekDay = date.toLocaleDateString(this.locale, {weekday: 'short'});
        const weekDayContainer = document.createElement('div');
        weekDayContainer.textContent = weekDay;
        weekDayContainer.classList.add('weekday');
        return weekDayContainer;
    }

    public renderAbbreviatedDate(date: Date): HTMLDivElement {
        const abbreviatedDate = date.toLocaleDateString(this.locale, {day: 'numeric', month: 'short'});
        const abbreviatedDateContainer = document.createElement('div');
        abbreviatedDateContainer.textContent = abbreviatedDate;
        abbreviatedDateContainer.classList.add('abbreviated-date');
        return abbreviatedDateContainer;
    }

    public renderDayButton(date: Date, event: CalendarEvent | undefined): HTMLDivElement {
        const input = document.createElement('div');
        input.classList.add('day');
        input.classList.add(event ? 'free' : 'taken');

        input.appendChild(this.renderWeekDay(date));
        input.appendChild(this.renderAbbreviatedDate(date));
        if (event) {
            input.onclick = this.onDayClick(date, event);
        }
        return input;
    }

    public onDayClick(date: Date, event: CalendarEvent) {
        return () => {
            this.input.setAttribute("value", event.uid);
            this.input.setAttribute("date", date.toISOString());
            this.input.textContent = date.toLocaleDateString(this.locale, {day: 'numeric', month: 'long'});
        };
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
