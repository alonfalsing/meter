import invariant from "tiny-invariant";
import { padStart } from "./strings";

export class ClockTime {
  readonly hour: number;
  readonly minute: number;

  constructor(minutes: number);
  constructor(hour: number, minute: number);
  constructor(m: number, n?: number) {
    if (n !== undefined) {
      this.hour = m;
      this.minute = n;
    } else {
      this.hour = Math.floor(m / 60);
      this.minute = m % 60;
    }

    invariant(
      0 <= this.hour && this.hour < 24 && 0 <= this.minute && this.minute < 60,
      `Invalid time: ${m}` + (n !== undefined ? `:${n}` : ""),
    );
  }

  [Symbol.toPrimitive](hint: string) {
    switch (hint) {
      case "number":
        return this.hour * 60 + this.minute;
      case "string":
      default:
        return [this.hour, this.minute]
          .map((each) => padStart(`${each}`, 2, "0"))
          .join(":");
    }
  }
}
