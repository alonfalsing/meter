import { describe, expect, test } from "@jest/globals";
import { ClockTime, TimeInterval } from "..";

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

  test.each([
    {
      name: "contains start time",
      time: new ClockTime(1, 0),
      want: true,
    },
    {
      name: "contains end time",
      time: new ClockTime(2, 0),
      want: true,
    },
    {
      name: "contains a time within the interval",
      time: new ClockTime(1, 30),
      want: true,
    },
    {
      name: "does not contain a time before the interval",
      time: new ClockTime(0, 30),
      want: false,
    },
    {
      name: "does not contain a time after the interval",
      time: new ClockTime(2, 30),
      want: false,
    },
  ])("$name", ({ time, want }) => {
    const interval = new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0));
    expect(interval.contains(time)).toBe(want);
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

  test.each([
    {
      name: "ticks a time interval",
      interval: new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
      minutes: 30,
      want: [new ClockTime(1, 0), new ClockTime(1, 30), new ClockTime(2, 0)],
    },
    {
      name: "ticks a time interval with a non-divisible minute",
      interval: new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0)),
      minutes: 45,
      want: [new ClockTime(1, 0), new ClockTime(1, 45)],
    },
  ])("$name", ({ interval, minutes, want }) => {
    expect(interval.tick(minutes)).toEqual(want);
  });

  test("stringifies a TimeInterval", () => {
    const interval = new TimeInterval(new ClockTime(1, 0), new ClockTime(2, 0));

    expect(interval.toString()).toBe("(01:00, 02:00)");
  });
});
