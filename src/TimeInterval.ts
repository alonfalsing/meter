import invariant from "tiny-invariant";
import { ClockTime } from "./ClockTime";

export class TimeInterval {
  constructor(
    readonly start: ClockTime,
    readonly end: ClockTime,
  ) {
    invariant(start < end, `Invalid time interval: ${start} ~ ${end}`);
  }

  contains(time: ClockTime): boolean {
    return this.start <= time && time <= this.end;
  }

  overlap(other: TimeInterval): boolean {
    return this.start < other.end && this.end > other.start;
  }

  subtract(other: TimeInterval): TimeInterval[] {
    if (!this.overlap(other)) {
      return [this];
    }

    if (this.start >= other.start && this.end <= other.end) {
      return [];
    }

    const intervals = [];
    if (this.start < other.start) {
      intervals.push(new TimeInterval(this.start, other.start));
    }
    if (this.end > other.end) {
      intervals.push(new TimeInterval(other.end, this.end));
    }

    return intervals;
  }

  alloc(minutes: number, anchor: "start" | "end"): TimeInterval[] {
    return this.subtract(
      anchor === "start"
        ? new TimeInterval(
            this.start,
            new ClockTime(Math.min(+this.start + minutes, +this.end)),
          )
        : new TimeInterval(
            new ClockTime(Math.max(+this.start, +this.end - minutes)),
            this.end,
          ),
    );
  }

  tick(minutes: number): ClockTime[] {
    return Array.from(
      { length: 1 + Math.floor((+this.end - +this.start) / minutes) },
      (_, i) => new ClockTime(+this.start + i * minutes),
    );
  }

  toString() {
    return `(${this.start}, ${this.end})`;
  }
}
