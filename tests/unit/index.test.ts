// packages/vs-brand-utils/src/index.test.ts

import { describe, it, expect } from "vitest";
import {
  brand,
  type Brand,
  isBrand,
  assertBrand,
  unbrand,
  unbrandArray,
  brandArray,
  brandMany,
  createBrand
} from "../../src/index";

type TestId = Brand<"TestId", string>;

describe("vs-brand-utils: runtime branding", () => {
  it("brands and enforces nominal typing", () => {
    const raw = "abc";
    const id = brand<"TestId", string>("TestId", raw);

    // At runtime, branded primitives are wrapped objects:
    expect(typeof id).toBe("object");

    // But at compile time this should error:
    // const plain: string = id; // ❌ Type 'Brand<"TestId", string>' is not assignable to type 'string'.
    // const wrong: TestId = 'xyz'; // ❌ Type 'string' is not assignable to type 'TestId'.
  });

  it("brands arrays and unbrands them", () => {
    type ArrId = Brand<"ArrId", string[]>;
    const arr = ["a", "b"];
    const brandedArr = brand<"ArrId", string[]>("ArrId", arr);
    expect(Array.isArray(brandedArr)).toBe(true);
    const plainArr: string[] = brandedArr;
    expect(plainArr).toEqual(arr);
  });

  it("prevents assigning branded to plain and vice versa", () => {
    type MyId = Brand<"MyId", number>;
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

describe("vs-brand-utils: compile-time type errors", () => {
  it("does not brand null or undefined", () => {
    // @ts-expect-error: This should error because null is not assignable to string
    brand<"TestId", string>("TestId", null);
    // @ts-expect-error: This should error because undefined is not assignable to string
    brand<"TestId", string>("TestId", undefined);
  });

  it("prevents double-branding with different keys", () => {
    type A = Brand<"A", string>;
    type B = Brand<"B", A>;
    const a = brand<"A", string>("A", "x");
    // @ts-expect-error: This should error because a is not assignable to B
    const b: B = a;
    expect(b).toBe(a);
    const a2: A = brand<"B", A>("B", a);
    expect(a2).toBe(a);
  });
});

describe("vs-brand-utils: helpers and createBrand", () => {
  type UserId = Brand<"UserId", string>;
  const key = "UserId" as const;
  const raw = "user-123";
  const branded = brand(key, raw);

  it("isBrand returns true for branded value", () => {
    expect(isBrand(key, branded)).toBe(true);
  });

  it("isBrand returns false for unbranded value", () => {
    // Use a value that was never branded
    const unbranded = "not-branded-unique-value-" + Math.random();
    expect(isBrand(key, unbranded)).toBe(false);
    expect(isBrand(key, 123)).toBe(false);
  });

  it("assertBrand does not throw for branded value", () => {
    expect(() => assertBrand(key, branded)).not.toThrow();
  });

  it("assertBrand throws for unbranded value", () => {
    expect(() => assertBrand(key, 123)).toThrow(TypeError);
  });

  it("unbrand returns the underlying value", () => {
    expect(unbrand(key, branded)).toBe(raw);
  });

  it("unbrandArray returns array of underlying values", () => {
    const arr = [branded, branded];
    expect(unbrandArray(key, arr)).toEqual([raw, raw]);
  });

  it("brandArray brands all values in array", () => {
    const arr = [raw, raw];
    const brandedArr = brandArray(key, arr);
    expect(brandedArr.every((v) => isBrand(key, v))).toBe(true);
  });

  it("brandArray handles empty arrays", () => {
    const arr: string[] = [];
    const brandedArr = brandArray(key, arr);
    expect(Array.isArray(brandedArr)).toBe(true);
    expect(brandedArr.length).toBe(0);
  });

  it("brandMany brands all values", () => {
    const brandedMany = brandMany(key, raw, raw);
    expect(brandedMany.every((v) => isBrand(key, v))).toBe(true);
  });

  it("brandMany handles no arguments", () => {
    const brandedMany = brandMany(key);
    expect(Array.isArray(brandedMany)).toBe(true);
    expect(brandedMany.length).toBe(0);
  });

  it("createBrand returns helpers that work as expected", () => {
    const UserIdBrand = createBrand<typeof key, string>(key);
    const b = UserIdBrand.brand(raw);
    expect(isBrand(key, b)).toBe(true);
    expect(UserIdBrand.is(b)).toBe(true);
    expect(UserIdBrand.isMany([b, b])).toBe(true);
    expect(() => UserIdBrand.assert(b)).not.toThrow();
    expect(() => UserIdBrand.assertMany([b, b])).not.toThrow();
    expect(UserIdBrand.unbrand(b)).toBe(raw);
    expect(UserIdBrand.unbrandMany([b, b])).toEqual([raw, raw]);
    const many = UserIdBrand.brandMany(raw, raw);
    expect(many.every((v) => UserIdBrand.is(v))).toBe(true);
  });

  it("createBrand.isMany returns false if any value is not branded", () => {
    const UserIdBrand = createBrand<typeof key, string>(key);
    const b = UserIdBrand.brand(raw);
    expect(UserIdBrand.isMany([b, raw])).toBe(false);
  });

  it("createBrand.assertMany throws if any value is not branded", () => {
    const UserIdBrand = createBrand<typeof key, string>(key);
    const b = UserIdBrand.brand(raw);
    expect(() => UserIdBrand.assertMany([b, raw])).toThrow(TypeError);
  });
});
