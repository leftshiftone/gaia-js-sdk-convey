import {IRenderer, ISpecification} from '../../api/IRenderer';

import {DatePicker} from "../datePicker";
import {CalendarEvent} from "../datePicker/calendar-event";
import Renderables from '../Renderables';

/**
 * Implementation of the 'datePicker' markup element.
 */
export class DateTimePicker extends DatePicker {
    private readonly timePicker: HTMLDivElement;
    private readonly timeButtonGroup: HTMLDivElement;
    private readonly backButton: HTMLButtonElement;

    constructor(specification: ISpecification) {
        super(specification);
        this.timePicker = document.createElement('div');
        this.timeButtonGroup = document.createElement('div');
        this.backButton = document.createElement('button');
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const dateTimePickerContainer = super.render(renderer, isNested);
        this.timePicker.style.display = 'none';
        dateTimePickerContainer.insertBefore(this.timePicker, this.input);

        this.backButton.textContent = '←';
        this.backButton.onclick = this.onBackClick();

        this.timeButtonGroup.classList.add('btn-group');

        this.timePicker.appendChild(this.backButton);
        this.timePicker.appendChild(this.timeButtonGroup);
        return dateTimePickerContainer;
    }

    public onBackClick(): () => void {
        return () => {
            this.input.textContent = "Select a date";
            this.timePicker.style.display = 'none';
            this.datePicker.style.display = 'block';
        };
    }

    public onDayClick(date: Date, event: CalendarEvent): () => void {
        return () => {
            this.datePicker.style.display = 'none';
            this.input.textContent = event.getDateString(this.locale) + ": Select a time";
            this.updateTimeButtons(date);
            this.timePicker.style.display = 'block';
        };
    }

    public updateTimeButtons(date: Date) {
        this.timeButtonGroup.innerHTML = "";

        this.events.filter(event => event.startsOnDay(date))
            .reverse()
            .forEach(
                event => {
                    const eventButton = document.createElement('button');
                    eventButton.textContent = event.getTimeIntervalString(this.locale);
                    eventButton.onclick = this.onTimeClick(event);
                    this.timeButtonGroup.appendChild(eventButton);
                }
            );
    }

    public onTimeClick(event: CalendarEvent) {
        return () => {
            this.input.setAttribute("value", event.uid);
            this.input.setAttribute("date", event.start.toISOString());
            this.input.textContent = event.getDateString(this.locale) + " " + event.getTimeIntervalString(this.locale);
        };
    }
}
Renderables.register("datetimepicker", DateTimePicker);
