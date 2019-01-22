export class CalendarEvent {
    public readonly start: Date;
    public readonly end: Date;
    public readonly uid: string;

    constructor(start: Date, end: Date, uid: string) {
        this.start = start;
        this.end = end;
        this.uid = uid;
    }

    public startsOnDay(date: Date): boolean {
        return this.startsInRange(date, CalendarEvent.addDays(date, 1));
    }

    public isInDateRange(rangeBegin: Date, rangeEndExclusive: Date): boolean {
        const rangeBeginWithoutTime = CalendarEvent.withoutTime(rangeBegin);
        const rangeEndExclusiveWithoutTime = CalendarEvent.withoutTime(new Date(rangeEndExclusive));
        return this.start < rangeEndExclusiveWithoutTime && this.end >= rangeBeginWithoutTime;
    }

    public startsInRange(rangeBegin: Date, rangeEndExclusive: Date): boolean {
        const rangeBeginWithoutTime = CalendarEvent.withoutTime(rangeBegin);
        const rangeEndExclusiveWithoutTime = CalendarEvent.withoutTime(new Date(rangeEndExclusive));
        return this.start < rangeEndExclusiveWithoutTime && this.start >= rangeBeginWithoutTime;
    }

    public getTimeIntervalString(locale: string) {
        return this.start.toLocaleTimeString(locale, {hour: 'numeric', minute: 'numeric'})
            + " - " + this.end.toLocaleTimeString(locale, {hour: 'numeric', minute: 'numeric'});
    }

    public getDateString(locale: string) {
        return this.start.toLocaleDateString(locale, {day: 'numeric', month: 'long'});
    }

    public static withoutTime(date: Date): Date {
        const dateWithoutTime = new Date(date);
        dateWithoutTime.setHours(0, 0, 0, 0);
        return dateWithoutTime;
    }

    public static addDays(date: Date, daysToAdd: number) {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + daysToAdd);
        return newDate;
    }
}
