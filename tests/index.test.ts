// packages/vs-brand-utils/src/index.test.ts

import { describe, it, expect } from "vitest";
import { brand, type Brand } from "../src/index";

type TestId = Brand<"TestId", string>;

describe("vs-brand-utils: runtime branding", () => {
  it("brands and enforces nominal typing", () => {
    const raw = "abc";
    const id = brand<"TestId", string>(raw);

    // At runtime it's still a string:
    expect(typeof id).toBe("string");

    // But at compile time this should error:
    // const plain: string = id; // ❌ Type 'Brand<"TestId", string>' is not assignable to type 'string'.
    // const wrong: TestId = 'xyz'; // ❌ Type 'string' is not assignable to type 'TestId'.
  });

  it("brands arrays and unbrands them", () => {
    type ArrId = Brand<"ArrId", string[]>;
    const arr = ["a", "b"];
    const brandedArr = brand<"ArrId", string[]>(arr);
    expect(Array.isArray(brandedArr)).toBe(true);
    const plainArr: string[] = brandedArr;
    expect(plainArr).toEqual(arr);
  });

  it("prevents assigning branded to plain and vice versa", () => {
    type MyId = Brand<"MyId", number>;
    const id = brand<"MyId", number>(123);
    const n: number = id;
    // @ts-expect-error: This should error because 456 is not assignable to MyId
    const id2: MyId = 456;
    expect(typeof id).toBe("number");

    expect(typeof n).toBe("number");
    expect(typeof id2).toBe("number");
    expect(typeof id).toBe("number");
  });
});

describe("vs-brand-utils: compile-time type errors", () => {
  it("does not brand null or undefined", () => {
    // @ts-expect-error: This should error because null is not assignable to string
    brand<"TestId", string>(null);
    // @ts-expect-error: This should error because undefined is not assignable to string
    brand<"TestId", string>(undefined);
  });

  it("prevents double-branding with different keys", () => {
    type A = Brand<"A", string>;
    type B = Brand<"B", A>;
    const a = brand<"A", string>("x");
    // @ts-expect-error: This should error because a is not assignable to B
    const b: B = a;
    expect(b).toBe(a);
    const a2: A = brand<"B", A>(a);
    expect(a2).toBe(a);
  });
});
