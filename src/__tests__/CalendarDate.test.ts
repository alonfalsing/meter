import { describe, expect, test } from "@jest/globals";
import { CalendarDate, DateUnit } from "..";

describe("CalendarDate", () => {
  test.each([
    {
      name: "constructs a CalendarDate",
      year: 2021,
      month: 1,
      day: 1,
    },
    {
      name: "constructs a CalendarDate with a default day",
      year: 2021,
      month: 1,
    },
  ])("$name", ({ year, month, day }) => {
    expect(() => new CalendarDate(year, month, day)).not.toThrow();
  });

  test("parses a string", () => {
    expect(CalendarDate.fromString("2021-01-01")).toEqual(
      new CalendarDate(2021, 1, 1),
    );
  });

  test("converts from a UTC date", () => {
    expect(CalendarDate.fromUTCDate(new Date(Date.UTC(2021, 0, 1)))).toEqual(
      new CalendarDate(2021, 1, 1),
    );
  });

  test("gets the day of the week", () => {
    const date = new CalendarDate(2021, 1, 1);
    expect(date.dayOfWeek).toBe(5);
  });

  test.each([
    {
      name: "adds a year",
      value: 1,
      unit: "year",
      want: new CalendarDate(2022, 1, 1),
    },
    {
      name: "adds a month",
      value: 1,
      unit: "month",
      want: new CalendarDate(2021, 2, 1),
    },
    {
      name: "adds over a year",
      value: 13,
      unit: "month",
      want: new CalendarDate(2022, 2, 1),
    },
    {
      name: "adds a day",
      value: 1,
      want: new CalendarDate(2021, 1, 2),
    },
    {
      name: "adds over a month",
      value: 31,
      unit: "day",
      want: new CalendarDate(2021, 2, 1),
    },
  ])("$name", ({ value, unit, want }) => {
    const date = new CalendarDate(2021, 1, 1);
    expect(date.add(value, unit as DateUnit)).toEqual(want);
  });

  test("calculates days from another date", () => {
    const date = new CalendarDate(2021, 1, 1);
    const other = new CalendarDate(2020, 12, 1);

    expect(date.daysFrom(other)).toBe(31);
  });

  test("converts to a number", () => {
    const date = new CalendarDate(2021, 1, 1);
    expect(+date).toBe(1609459200);
  });

  test("converts to a string", () => {
    const date = new CalendarDate(2021, 1, 1);
    expect(`${date}`).toBe("2021-01-01");
  });

  test("converts to a date", () => {
    const date = new CalendarDate(2021, 1, 1);
    expect(date.toDate()).toEqual(new Date(Date.UTC(2021, 0, 1)));
  });
});
