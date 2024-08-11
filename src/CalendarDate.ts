import invariant from "tiny-invariant";
import { padStart } from "./strings";

export type DateUnit = "year" | "years" | "month" | "months" | "day" | "days";

export class CalendarDate {
  private date: Date;

  static fromString(str: string): CalendarDate {
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    invariant(match, `Invalid date: ${str}`);

    return new CalendarDate(
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3]),
    );
  }

  static fromUTCDate(date: Date): CalendarDate {
    return new CalendarDate(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
    );
  }

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

  add(value: number, unit: DateUnit = "days") {
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
