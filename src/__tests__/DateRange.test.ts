import { describe, expect, test } from "@jest/globals";
import { CalendarDate, CalendarMonth, CalendarWeek, DateRange } from "..";

describe("DateRange", () => {
  test.each([
    {
      name: "constructs a DateRange",
      from: new CalendarDate(2021, 1, 1),
      thru: new CalendarDate(2021, 1, 31),
    },
    {
      name: "constructs a one-day DateRange",
      from: new CalendarDate(2021, 1, 1),
      thru: new CalendarDate(2021, 1, 1),
    },
  ])("$name", ({ from, thru }) => {
    const range = new DateRange(from, thru);

    expect(range.from).toEqual(from);
    expect(range.thru).toEqual(thru);
  });

  test("throws an error for an invalid date range", () => {
    expect(
      () =>
        new DateRange(
          new CalendarDate(2021, 1, 31),
          new CalendarDate(2021, 1, 1),
        ),
    ).toThrowError("Invalid date range: 2021-01-31 ~ 2021-01-01");
  });

  test.each([
    {
      name: "contains a date",
      from: new CalendarDate(2021, 1, 1),
      thru: new CalendarDate(2021, 1, 31),
      date: new CalendarDate(2021, 1, 15),
      expected: true,
    },
    {
      name: "does not contain a date",
      from: new CalendarDate(2021, 1, 1),
      thru: new CalendarDate(2021, 1, 31),
      date: new CalendarDate(2021, 2, 1),
      expected: false,
    },
  ])("$name", ({ from, thru, date, expected }) => {
    const range = new DateRange(from, thru);

    expect(range.contains(date)).toBe(expected);
  });

  test("computes the length", () => {
    const range = new DateRange(
      new CalendarDate(2021, 1, 1),
      new CalendarDate(2021, 2, 28),
    );

    expect(range.length).toBe(59);
  });

  test("computes the days", () => {
    const range = new DateRange(
      new CalendarDate(2021, 1, 3),
      new CalendarDate(2021, 1, 9),
    );

    expect(range.days).toEqual([
      new CalendarDate(2021, 1, 3),
      new CalendarDate(2021, 1, 4),
      new CalendarDate(2021, 1, 5),
      new CalendarDate(2021, 1, 6),
      new CalendarDate(2021, 1, 7),
      new CalendarDate(2021, 1, 8),
      new CalendarDate(2021, 1, 9),
    ]);
  });
});

describe("CalendarWeek", () => {
  test("constructs a CalendarWeek", () => {
    const week = new CalendarWeek(new CalendarDate(2021, 1, 1));

    expect(week.from).toEqual(new CalendarDate(2020, 12, 27));
    expect(week.thru).toEqual(new CalendarDate(2021, 1, 2));
  });
});

describe("CalendarMonth", () => {
  test("constructs a CalendarMonth", () => {
    const month = new CalendarMonth(2021, 1);

    expect(month.from).toEqual(new CalendarDate(2020, 12, 27));
    expect(month.thru).toEqual(new CalendarDate(2021, 2, 6));
    expect(month.startOfMonth).toEqual(new CalendarDate(2021, 1, 1));
    expect(month.endOfMonth).toEqual(new CalendarDate(2021, 1, 31));
  });
});
