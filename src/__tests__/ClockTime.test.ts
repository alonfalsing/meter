import { describe, expect, test } from "@jest/globals";
import { ClockTime } from "../ClockTime";

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

  test("converts to a number", () => {
    const time = new ClockTime(1, 30);
    expect(+time).toBe(90);
  });

  test("converts to a string", () => {
    const time = new ClockTime(1, 30);
    expect(`${time}`).toBe("01:30");
  });
});
