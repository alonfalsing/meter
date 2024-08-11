import { CalendarDate, DateUnit } from "./CalendarDate";
import { ClockTime } from "./ClockTime";

export type TimeUnit =
  | "hour"
  | "hours"
  | "minute"
  | "minutes"
  | "second"
  | "seconds";

export class Instant {
  static fromString(str: string): Instant {
    const [dateStr, timeStr] = str.split("T");
    return new Instant(
      CalendarDate.fromString(dateStr),
      ClockTime.fromString(timeStr),
    );
  }

  static fromUTCDate(date: Date): Instant {
    return new Instant(
      CalendarDate.fromUTCDate(date),
      ClockTime.fromUTCDate(date),
    );
  }

  constructor(
    readonly date: CalendarDate,
    readonly time: ClockTime,
  ) {}

  add(value: number, unit: DateUnit | TimeUnit) {
    const seconds: Record<TimeUnit, number> = {
      second: 1,
      seconds: 1,
      minute: 60,
      minutes: 60,
      hour: 60 * 60,
      hours: 60 * 60,
    };
    if (unit in seconds) {
      return Instant.fromUTCDate(
        new Date((+this + value * seconds[unit as TimeUnit]) * 1000),
      );
    }

    return new Instant(this.date.add(value, unit as DateUnit), this.time);
  }

  [Symbol.toPrimitive](hint: string) {
    switch (hint) {
      case "number":
        return +this.date + 60 * +this.time;
      case "string":
      default:
        return `${this.date}T${this.time}`;
    }
  }

  toDate() {
    return new Date(+this * 1000);
  }
}
