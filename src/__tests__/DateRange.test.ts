import { describe, expect, test } from "@jest/globals";
import { CalendarDate, DateRange } from "..";

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

  test("builds a month range", () => {
    const range = DateRange.month(2021, 1);

    expect(range.from).toEqual(new CalendarDate(2021, 1, 1));
    expect(range.thru).toEqual(new CalendarDate(2021, 1, 31));
  });
});
