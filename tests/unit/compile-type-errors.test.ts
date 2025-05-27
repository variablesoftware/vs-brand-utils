import { describe, it, expect } from "vitest";
import { brand } from "../../src/index";

describe("vs-brand-utils: compile-time type errors", () => {
  it("does not brand null or undefined", () => {
    // @ts-expect-error: This should error because null is not assignable to string
    brand<"TestId", string>("TestId", null);
    // @ts-expect-error: This should error because undefined is not assignable to string
    brand<"TestId", string>("TestId", undefined);
  });

  it("prevents double-branding with different keys", () => {
    type A = brand<"A", string>;
    type B = brand<"B", A>;
    const a = brand<"A", string>("A", "x");
    // @ts-expect-error: This should error because a is not assignable to B
    const b: B = a;
    expect(b).toBe(a);
    const a2: A = brand<"B", A>("B", a);
    expect(a2).toBe(a);
  });
});
