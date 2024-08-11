import { CalendarDate } from "./CalendarDate";
import invariant from "tiny-invariant";

/**
 * Date range is a pair of calendar dates, `from` and `thru` (inclusive).
 */
export class DateRange {
  constructor(
    readonly from: CalendarDate,
    readonly thru: CalendarDate,
  ) {
    invariant(from <= thru, `Invalid date range: ${from} ~ ${thru}`);
  }

  contains(date: CalendarDate) {
    return this.from <= date && date <= this.thru;
  }

  get length(): number {
    return 1 + this.thru.daysFrom(this.from);
  }

  get days(): CalendarDate[] {
    return Array.from({ length: this.length }, (_, i) =>
      this.from.add(i, "days"),
    );
  }
}

export class CalendarWeek extends DateRange {
  constructor(date: CalendarDate) {
    const sunday = date.add(-date.dayOfWeek, "days");
    super(sunday, sunday.add(6, "days"));
  }
}

export class CalendarMonth extends DateRange {
  readonly startOfMonth: CalendarDate;
  readonly endOfMonth: CalendarDate;

  constructor(year: number, month: number) {
    const startOfMonth = new CalendarDate(year, month, 1);
    const endOfMonth = new CalendarDate(year, month + 1, 0);
    const firstWeek = new CalendarWeek(startOfMonth);
    const lastWeek = new CalendarWeek(endOfMonth);

    super(firstWeek.from, lastWeek.thru);
    this.startOfMonth = startOfMonth;
    this.endOfMonth = endOfMonth;
  }

  get year() {
    return this.startOfMonth.year;
  }

  get month() {
    return this.startOfMonth.month;
  }
}
