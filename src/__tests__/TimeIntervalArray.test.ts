import { describe, expect, test } from "@jest/globals";
import { ClockTime, TimeInterval, TimeIntervalArray } from "..";

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
      "Overlapping intervals: (01:00, 02:00), (01:30, 02:30)",
    );
  });

  test("checks if a time is contained in any interval", () => {
    const intervalArray = new TimeIntervalArray([
      new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
      new TimeInterval(new ClockTime(3, 0), new ClockTime(4, 0)),
    ]);

    expect(intervalArray.contains(new ClockTime(1, 30))).toBe(true);
    expect(intervalArray.contains(new ClockTime(2, 30))).toBe(false);
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

  test.each([
    {
      name: "allocates time from the start",
      minutes: 30,
      anchor: "start",
      want: new TimeIntervalArray([
        new TimeInterval(new ClockTime(1, 30), new ClockTime(2, 0)),
        new TimeInterval(new ClockTime(3, 30), new ClockTime(4, 0)),
      ]),
    },
    {
      name: "allocates time from the end",
      minutes: 30,
      anchor: "end",
      want: new TimeIntervalArray([
        new TimeInterval(new ClockTime(1, 0), new ClockTime(1, 30)),
        new TimeInterval(new ClockTime(3, 0), new ClockTime(3, 30)),
      ]),
    },
    {
      name: "allocates zero time",
      minutes: 0,
      anchor: "start",
      want: new TimeIntervalArray([
        new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
        new TimeInterval(new ClockTime(3, 0), new ClockTime(4, 0)),
      ]),
    },
  ] as const)("$name", ({ minutes, anchor, want }) => {
    const intervalArray = new TimeIntervalArray([
      new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
      new TimeInterval(new ClockTime(3, 0), new ClockTime(4, 0)),
    ]);

    expect(intervalArray.alloc(minutes, anchor)).toEqual(want);
  });

  test("stringifies a TimeIntervalArray", () => {
    const intervalArray = new TimeIntervalArray([
      new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
      new TimeInterval(new ClockTime(3, 0), new ClockTime(4, 0)),
    ]);

    expect(intervalArray.toString()).toBe("[(01:00, 02:00), (03:00, 04:00)]");
  });
});
