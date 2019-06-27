import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'calendar' markup element.
 */
export class Calendar implements IRenderable {

    private readonly spec: ISpecification;
    private readonly months: Array<[string, number]>;
    private readonly input: HTMLDivElement;
    private readonly calendar: HTMLDivElement;
    private readonly calendarTable: HTMLTableElement;
    private readonly calendarTableBody: HTMLTableSectionElement;
    private readonly headline: HTMLDivElement;
    private readonly yearInput: HTMLInputElement;
    private readonly monthSelect: HTMLSelectElement;
    private today: Date;
    private currentMonth: number;
    private currentYear: number;

    constructor(spec: ISpecification) {
        this.spec = spec;
        this.today = new Date();
        this.currentMonth = this.today.getMonth();
        this.currentYear = this.today.getFullYear();
        this.months = [["JAN", 0], ["FEB", 1], ["MAR", 2], ["APR", 3], ["MAI", 4], ["JUN", 5], ["JUL", 6], ["AUG", 7], ["SEP", 8], ["OKT", 9], ["NOV", 10], ["DEZ", 11]];
        this.input = this.renderInput();
        this.headline = Calendar.renderHeadline();
        this.monthSelect = this.renderMonthSelect();
        this.yearInput = this.renderYearInput();
        this.calendar = document.createElement('div');
        this.calendarTable = document.createElement('table');
        this.calendarTableBody = document.createElement('tbody');
    }

    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const calendarContainer = document.createElement('div');
        if(this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => calendarContainer.classList.add(e));
        }
        const position = this.spec.position || 'left';

        if (isNested) { calendarContainer.classList.add("lto-nested") }

        calendarContainer.classList.add("lto-calendar-container", "lto-" + position);

        this.calendar.classList.add("lto-calendar");

        this.calendarTable.appendChild(this.renderCalendarTableHeader());
        this.calendarTable.appendChild(this.calendarTableBody);

        this.calendar.appendChild(this.renderHeader());
        this.calendar.appendChild(this.calendarTable);
        this.calendar.appendChild(this.renderControl());

        this.updateCalendar();

        calendarContainer.appendChild(this.input);
        calendarContainer.appendChild(this.calendar);

        return calendarContainer;
    }

    public showCalendar(): void {
        this.calendar.style.display = "inline-block";
        this.input.style.display = "none";
    }

    public hideCalendar(date: string): void {
        this.calendar.style.display = "none";
        this.input.style.display = "inline-block";
        this.input.innerText = date;
        this.input.setAttribute("value", date);
    }

    public static renderHeadline(): HTMLDivElement {
        const headline = document.createElement('div');
        headline.classList.add('lto-calendar-headline');
        return headline;
    }

    public renderInput(): HTMLDivElement {
        const input = document.createElement('div');
        input.classList.add('lto-calendar-input');
        input.setAttribute("name", this.spec.name || "");
        input.textContent = "Click to select a day";
        input.onclick = () => this.showCalendar();
        return input;
    }

    public renderCalendarTableHeader(): HTMLTableSectionElement {
        const header = document.createElement('thead');

        ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
            .forEach(day => {
                const cell = document.createElement('td');
                cell.textContent = day;
                header.appendChild(cell);
            });

        return header;
    }

    public renderHeader(): HTMLDivElement {
        const header = document.createElement("div");
        const control = document.createElement("div");
        const next = document.createElement("button");
        const previous = document.createElement("button");

        header.classList.add("lto-calendar-header");
        control.classList.add("lto-calendar-control");
        next.classList.add("lto-calendar-next-month");
        previous.classList.add("lto-calendar-previous-month");

        next.innerText = "next";
        previous.innerText = "previous";
        next.onclick = () => this.next();
        previous.onclick = () => this.previous();

        control.appendChild(previous);
        control.appendChild(next);
        header.appendChild(this.headline);
        header.appendChild(control);

        return header;
    }

    public renderControl(): HTMLDivElement {
        const control = document.createElement("div");
        control.appendChild(this.monthSelect);
        control.appendChild(this.yearInput);
        return control;
    }

    public renderYearInput(): HTMLInputElement {
        const yearInput = document.createElement("input");
        yearInput.classList.add("lto-calendar-year-select");
        yearInput.onchange = () => {
            this.currentYear = parseInt(yearInput.value);
            this.updateCalendar();
        };
        yearInput.setAttribute("type", "number");
        yearInput.step = "1";
        yearInput.value = this.today.getFullYear() + "";
        return yearInput
    }

    public renderMonthSelect(): HTMLSelectElement {
        const monthSelect = document.createElement("select");
        monthSelect.classList.add("lto-calendar-month-select");
        monthSelect.onchange = () => {
            this.currentMonth = parseInt(monthSelect.value);
            this.updateCalendar();
        };
        monthSelect.name = 'month';
        this.months.forEach((month: [string, number]) => {
            const option = document.createElement("option");
            option.text = month[0];
            option.value = month[1].toString();
            monthSelect.add(option);
        });
        return monthSelect;
    }


    public updateCalendar() {
        let firstDay = (new Date(this.currentYear, this.currentMonth)).getDay();
        let daysInMonth = 32 - new Date(this.currentYear, this.currentMonth, 32).getDate();

        this.calendarTableBody.innerHTML = "";

        this.updateHeadline();

        let date = 1;

        for (let i = 0; i < 6; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement("td");
                if (i === 0 && j < firstDay - 1) {
                    const cellText = document.createTextNode("");
                    cell.appendChild(cellText);
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const cellText = document.createTextNode(date + "");
                    if (date === this.today.getDate() && this.currentYear === this.today.getFullYear() && this.currentMonth === this.today.getMonth()) {
                        cell.classList.add("lto-calendar-today")
                    }
                    cell.onclick = () => this.hideCalendar(cell.innerText + " " + this.months[this.currentMonth][0] + " " + this.currentYear);
                    cell.appendChild(cellText);
                    date++;
                }
                row.appendChild(cell);
            }

            this.calendarTableBody.appendChild(row);
        }

    }

    public updateHeadline(): void {
        this.headline.innerHTML = this.months[this.currentMonth][0] + " " + this.currentYear
    }

    public updateControl(): void {
        this.yearInput.value = this.currentYear.toString();
        this.monthSelect.value = this.currentMonth.toString()
    }

    public next() {
        this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        this.updateControl();
        this.updateCalendar();
    }

    public previous() {
        this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
        this.updateControl();
        this.updateCalendar();
    }

}
Renderables.register("calendar", Calendar);
