import { describe, expect, test } from "@jest/globals";
import { ClockTime } from "../ClockTime";
import { TimeInterval } from "../TimeInterval";
import { TimeIntervalArray } from "../TimeIntervalArray";

describe("TimeIntervalArray", () => {
  test("constructs a TimeIntervalArray", () => {
    expect(() => new TimeIntervalArray([])).not.toThrow();
    expect(
      () =>
        new TimeIntervalArray([
          new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
          new TimeInterval(new ClockTime(2, 0), new ClockTime(3, 0)),
        ]),
    ).not.toThrow();
  });

  test("throws an error for overlapping intervals", () => {
    const intervals = [
      new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
      new TimeInterval(new ClockTime(1, 30), new ClockTime(2, 30)),
    ];

    expect(() => new TimeIntervalArray(intervals)).toThrowError(
      "Overlapping intervals: 01:00 ~ 02:00, 01:30 ~ 02:30",
    );
  });

  test.each([
    {
      name: "subtracts a non-overlapping interval",
      interval: new TimeInterval(new ClockTime(2, 0), new ClockTime(3, 0)),
      want: new TimeIntervalArray([
        new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
        new TimeInterval(new ClockTime(3, 0), new ClockTime(4, 0)),
      ]),
    },
    {
      name: "subtracts a fully overlapping interval",
      interval: new TimeInterval(new ClockTime(1, 0), new ClockTime(3, 0)),
      want: new TimeIntervalArray([
        new TimeInterval(new ClockTime(3, 0), new ClockTime(4, 0)),
      ]),
    },
    {
      name: "subtracts a partially overlapping interval",
      interval: new TimeInterval(new ClockTime(1, 30), new ClockTime(3, 30)),
      want: new TimeIntervalArray([
        new TimeInterval(new ClockTime(1, 0), new ClockTime(1, 30)),
        new TimeInterval(new ClockTime(3, 30), new ClockTime(4, 0)),
      ]),
    },
    {
      name: "subtracts an interval that fully contains other intervals",
      interval: new TimeInterval(new ClockTime(0, 0), new ClockTime(4, 0)),
      want: new TimeIntervalArray([]),
    },
  ])("$name", ({ interval, want }) => {
    const intervalArray = new TimeIntervalArray([
      new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
      new TimeInterval(new ClockTime(3, 0), new ClockTime(4, 0)),
    ]);

    expect(intervalArray.subtract(interval)).toEqual(want);
  });
});
