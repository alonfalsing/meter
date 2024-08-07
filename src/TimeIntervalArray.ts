import invariant from "tiny-invariant";
import { TimeInterval } from "./TimeInterval";

export class TimeIntervalArray {
  constructor(readonly intervals: TimeInterval[]) {
    this.intervals
      .slice(1)
      .forEach((each, i) =>
        invariant(
          this.intervals[i].end <= each.start,
          `Overlapping intervals: ${this.intervals[i]}, ${each}`,
        ),
      );
  }

  subtract(other: TimeInterval): TimeIntervalArray {
    return new TimeIntervalArray(
      this.intervals.flatMap((each) => each.subtract(other)),
    );
  }

  toString() {
    return `[${this.intervals.join(", ")}]`;
  }
}
