import { describe, expect, test } from "@jest/globals";
import { ClockTime } from "..";

describe("ClockTime", () => {
  test("constructs a ClockTime from minutes", () => {
    const time = new ClockTime(90);

    expect(time.hour).toBe(1);
    expect(time.minute).toBe(30);
  });

  test("constructs a ClockTime from hours and minutes", () => {
    const time = new ClockTime(1, 30);

    expect(time.hour).toBe(1);
    expect(time.minute).toBe(30);
  });

  test.each([
    {
      minute: -1,
      error: "Invalid time: -1",
    },
    {
      minute: 1440,
      error: "Invalid time: 1440",
    },
    {
      hour: 24,
      minute: 0,
      error: "Invalid time: 24:0",
    },
    {
      hour: 0,
      minute: 60,
      error: "Invalid time: 0:60",
    },
  ])("throws an error for an invalid time", ({ hour, minute, error }) => {
    expect(() =>
      hour !== undefined ? new ClockTime(hour, minute) : new ClockTime(minute),
    ).toThrowError(error);
  });

  test.each([
    {
      name: "parses a string",
      input: "01:30",
      want: new ClockTime(1, 30),
    },
    {
      name: "parses a string with leading zero",
      input: "01:03",
      want: new ClockTime(1, 3),
    },
    {
      name: "parses a string with single digit hour",
      input: "1:30",
      want: new ClockTime(1, 30),
    },
    {
      name: "parses a string with single digit minute",
      input: "01:3",
      want: new ClockTime(1, 3),
    },
    {
      name: "parses a string with single digit hour and minute",
      input: "1:3",
      want: new ClockTime(1, 3),
    },
  ])("$name", ({ input, want }) => {
    expect(ClockTime.fromString(input)).toEqual(want);
  });

  test("converts from a Date", () => {
    const date = new Date(Date.UTC(2021, 0, 1, 1, 30));
    expect(ClockTime.fromUTCDate(date)).toEqual(new ClockTime(1, 30));
  });

  test("converts to a number", () => {
    const time = new ClockTime(1, 30);
    expect(+time).toBe(90);
  });

  test("converts to a string", () => {
    const time = new ClockTime(1, 30);
    expect(`${time}`).toBe("01:30");
  });
});
