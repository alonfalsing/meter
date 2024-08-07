import { CalendarDate } from "./CalendarDate";
import invariant from "tiny-invariant";

/**
 * Date range is a pair of calendar dates, `from` and `thru` (inclusive).
 */
export class DateRange {
  static month(year: number, month: number): DateRange {
    return new DateRange(
      new CalendarDate(year, month, 1),
      new CalendarDate(year, month + 1, 0),
    );
  }

  constructor(
    readonly from: CalendarDate,
    readonly thru: CalendarDate,
  ) {
    invariant(from <= thru, `Invalid date range: ${from} ~ ${thru}`);
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
