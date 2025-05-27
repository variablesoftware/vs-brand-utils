import { describe, it, expect } from "vitest";
import { brand, unbrand } from "../../src/index";

describe("vs-brand-utils: runtime branding", () => {
  it("brands and enforces nominal typing", () => {
    const raw = "abc";
    const id = brand<"TestId", string>("TestId", raw);
    expect(typeof id).toBe("object");
  });

  it("brands arrays and unbrands them", () => {
    type ArrId = brand<"ArrId", string[]>;
    const arr = ["a", "b"];
    const brandedArr = brand<"ArrId", string[]>("ArrId", arr);
    expect(Array.isArray(brandedArr)).toBe(true);
    const plainArr: string[] = brandedArr;
    expect(plainArr).toEqual(arr);
  });

  it("prevents assigning branded to plain and vice versa", () => {
    type MyId = brand<"MyId", number>;
    const id = brand<"MyId", number>("MyId", 123);
    const n: number = unbrand("MyId", id);
    // @ts-expect-error: This should error because 456 is not assignable to MyId
    const id2: MyId = 456;
    expect(typeof id).toBe("object");
    expect(typeof n).toBe("number");
    expect(typeof id2).toBe("number");
    expect(typeof id).toBe("object");
  });
});
