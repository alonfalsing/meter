import { padStart } from "./strings";

export type CalendarUnit =
  | "year"
  | "years"
  | "month"
  | "months"
  | "day"
  | "days";

export class CalendarDate {
  private date: Date;

  constructor(year: number, month: number, day: number = 1) {
    this.date = new Date(Date.UTC(year, month - 1, day));
  }

  get year() {
    return this.date.getUTCFullYear();
  }

  get month() {
    return this.date.getUTCMonth() + 1;
  }

  get day() {
    return this.date.getUTCDate();
  }

  get dayOfWeek() {
    return this.date.getUTCDay();
  }

  add(value: number, unit: CalendarUnit = "days") {
    const { year, month, day } = this;
    switch (unit) {
      case "year":
      case "years":
        return new CalendarDate(year + value, month, day);

      case "month":
      case "months":
        return new CalendarDate(year, month + value, day);

      case "day":
      case "days":
        return new CalendarDate(year, month, day + value);
    }
  }

  daysFrom(other: CalendarDate) {
    return Math.floor(
      (this.date.getTime() - other.date.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  [Symbol.toPrimitive](hint: string) {
    switch (hint) {
      case "number":
        return this.date.getTime() / 1000;
      case "string":
      default:
        return [this.year, this.month, this.day]
          .map((each) => padStart(`${each}`, 2, "0"))
          .join("-");
    }
  }
}
