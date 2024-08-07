import invariant from "tiny-invariant";
import { ClockTime } from "./ClockTime";

export class TimeInterval {
  constructor(
    readonly start: ClockTime,
    readonly end: ClockTime,
  ) {
    invariant(start < end, `Invalid time interval: ${start} ~ ${end}`);
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

  toString() {
    return `(${this.start}, ${this.end})`;
  }
}
