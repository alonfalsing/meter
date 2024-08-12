import { describe, expect, test } from "@jest/globals";
import { CalendarDate, ClockTime, Instant } from "..";

describe("Instant", () => {
  test.each([
    {
      name: "parses a string",
      str: "2021-01-01T00:00",
      want: new Instant(new CalendarDate(2021, 1, 1), new ClockTime(0, 0)),
    },
    {
      name: "parses a string with a space",
      str: "2021-01-01 01:30",
      want: new Instant(new CalendarDate(2021, 1, 1), new ClockTime(1, 30)),
    },
  ])("$name", ({ str, want }) => {
    expect(Instant.fromString(str)).toEqual(want);
  });

  test("converts from a UTC date", () => {
    expect(Instant.fromUTCDate(new Date(Date.UTC(2021, 0, 1, 0, 0)))).toEqual(
      new Instant(new CalendarDate(2021, 1, 1), new ClockTime(0, 0)),
    );
  });

  test.each([
    {
      name: "adds seconds",
      value: 1,
      unit: "seconds" as const,
      want: new Instant(new CalendarDate(2021, 1, 1), new ClockTime(0, 0)),
    },
    {
      name: "adds minutes",
      value: 1,
      unit: "minutes" as const,
      want: new Instant(new CalendarDate(2021, 1, 1), new ClockTime(0, 1)),
    },
    {
      name: "adds hours",
      value: 1,
      unit: "hours" as const,
      want: new Instant(new CalendarDate(2021, 1, 1), new ClockTime(1, 0)),
    },
    {
      name: "adds over a day",
      value: 25,
      unit: "hours" as const,
      want: new Instant(new CalendarDate(2021, 1, 2), new ClockTime(1, 0)),
    },
    {
      name: "adds a day",
      value: 1,
      unit: "days" as const,
      want: new Instant(new CalendarDate(2021, 1, 2), new ClockTime(0, 0)),
    },
  ])("$name", ({ value, unit, want }) => {
    const instant = new Instant(
      new CalendarDate(2021, 1, 1),
      new ClockTime(0, 0),
    );
    expect(instant.add(value, unit)).toEqual(want);
  });

  test("converts to a number", () => {
    const instant = new Instant(
      new CalendarDate(2021, 1, 1),
      new ClockTime(1, 30),
    );
    expect(+instant).toBe(1609464600);
  });

  test("converts to a string", () => {
    const instant = new Instant(
      new CalendarDate(2021, 1, 1),
      new ClockTime(1, 30),
    );
    expect(`${instant}`).toBe("2021-01-01T01:30");
  });

  test("converts to a date", () => {
    const instant = new Instant(
      new CalendarDate(2021, 1, 1),
      new ClockTime(1, 30),
    );
    expect(instant.toDate()).toEqual(new Date(Date.UTC(2021, 0, 1, 1, 30)));
  });
});
