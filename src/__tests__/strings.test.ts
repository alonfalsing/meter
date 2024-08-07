import { describe, expect, test } from "@jest/globals";
import { padStart } from "../strings";

describe("padStart", () => {
  test.each([
    {
      name: "pads a string with spaces",
      length: 10,
      want: "     hello",
    },
    {
      name: "pads a string with a custom pad",
      length: 10,
      pad: "-",
      want: "-----hello",
    },
    {
      name: "does not pad a string that is long enough",
      length: 3,
      want: "hello",
    },
  ])("$name", ({ length, pad, want }) => {
    expect(padStart("hello", length, pad)).toBe(want);
  });
});
