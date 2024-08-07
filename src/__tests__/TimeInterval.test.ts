import { describe, expect, test } from "@jest/globals";
import { ClockTime } from "../ClockTime";
import { TimeInterval } from "../TimeInterval";

describe("TimeInterval", () => {
  test("constructs a TimeInterval", () => {
    const start = new ClockTime(1, 30);
    const end = new ClockTime(2, 0);
    const interval = new TimeInterval(start, end);

    expect(interval.start).toBe(start);
    expect(interval.end).toBe(end);
  });

  test.each([
    {
      name: "throws an error for an invalid time interval",
      start: new ClockTime(2, 0),
      end: new ClockTime(1, 30),
    },
    {
      name: "throws an error for an empty time interval",
      start: new ClockTime(1, 30),
      end: new ClockTime(1, 30),
    },
  ])("$name", ({ start, end }) => {
    expect(() => new TimeInterval(start, end)).toThrowError(
      `Invalid time interval: ${start} ~ ${end}`,
    );
  });

  test("checks for overlap", () => {
    const interval1 = new TimeInterval(
      new ClockTime(1, 0),
      new ClockTime(2, 0),
    );
    const interval2 = new TimeInterval(
      new ClockTime(1, 30),
      new ClockTime(2, 30),
    );
    const interval3 = new TimeInterval(
      new ClockTime(2, 0),
      new ClockTime(3, 0),
    );

    expect(interval1.overlap(interval2)).toBe(true);
    expect(interval1.overlap(interval3)).toBe(false);
  });

  test.each([
    {
      name: "subtracts a non-overlapping interval",
      interval1: new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
      interval2: new TimeInterval(new ClockTime(3, 0), new ClockTime(4, 0)),
      want: [new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0))],
    },
    {
      name: "subtracts a fully overlapping interval",
      interval1: new TimeInterval(new ClockTime(1, 0), new ClockTime(3, 0)),
      interval2: new TimeInterval(new ClockTime(1, 0), new ClockTime(3, 0)),
      want: [],
    },
    {
      name: "subtracts a fully contained interval",
      interval1: new TimeInterval(new ClockTime(1, 0), new ClockTime(3, 0)),
      interval2: new TimeInterval(new ClockTime(1, 30), new ClockTime(2, 30)),
      want: [
        new TimeInterval(new ClockTime(1, 0), new ClockTime(1, 30)),
        new TimeInterval(new ClockTime(2, 30), new ClockTime(3, 0)),
      ],
    },
    {
      name: "subtracts a partially overlapping interval",
      interval1: new TimeInterval(new ClockTime(1, 0), new ClockTime(3, 0)),
      interval2: new TimeInterval(new ClockTime(2, 0), new ClockTime(4, 0)),
      want: [new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0))],
    },
  ])("$name", ({ interval1, interval2, want }) => {
    expect(interval1.subtract(interval2)).toEqual(want);
  });

  test("stringifies a TimeInterval", () => {
    const interval = new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0));

    expect(interval.toString()).toBe("(01:00, 02:00)");
  });
});
