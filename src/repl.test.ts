import { cleanInput } from "./repl";
import { describe, expect, test } from "vitest";

describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "  foo  bar  ",
    expected: ["foo", "bar"],
  },
  {
    input: "  baz  qux  ",
    expected: ["baz", "qux"],
  },
])("cleanInput", ({ input, expected }) => {
  test(`cleans up the input: "${input}"`, () => {
    expect(cleanInput(input)).toEqual(expected);
  });
});