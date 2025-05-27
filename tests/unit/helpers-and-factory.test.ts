import { describe, it, expect } from "vitest";
import {
  brand,
  isBrand,
  assertBrand,
  unbrand,
  unbrandArray,
  brandArray,
  brandMany,
  createBrand
} from "../../src/index";

describe("vs-brand-utils: helpers and createBrand", () => {
  type UserId = ReturnType<typeof brand>;
  const key = "UserId" as const;
  const raw = "user-123";
  const branded = brand(key, raw);

  it("isBrand returns true for branded value", () => {
    expect(isBrand(key, branded)).toBe(true);
  });

  it("isBrand returns false for unbranded value", () => {
    const unbranded = "not-branded-unique-value-" + Math.random();
    expect(isBrand(key, unbranded)).toBe(false);
    expect(isBrand(key, 123)).toBe(false);
  });

  it("isBrand returns false for null and undefined", () => {
    expect(isBrand(key, null)).toBe(false);
    expect(isBrand(key, undefined)).toBe(false);
  });

  it("isBrand returns false for branded wrapper with wrong key", () => {
    const otherKey = "OtherUserId" as const;
    const brandedOther = brand(otherKey, raw);
    expect(isBrand(key, brandedOther)).toBe(false);
  });

  it("isBrand returns false for a plain object without brand marker", () => {
    expect(isBrand(key, { value: raw })).toBe(false);
  });

  it("isBrand returns false for a branded wrapper with a different key (object)", () => {
    const otherKey = "OtherUserId" as const;
    const brandedOther = brand(otherKey, { foo: 1 });
    expect(isBrand(key, brandedOther)).toBe(false);
  });

  it("isBrand returns false for a branded primitive wrapper with a different key", () => {
    const otherKey = "OtherUserId" as const;
    const brandedOther = brand(otherKey, 42);
    expect(isBrand(key, brandedOther)).toBe(false);
  });

  it("isBrand returns false for a branded primitive wrapper with a missing key", () => {
    const branded = brand(key, 99);
    delete (branded as any)[Symbol.for('vs-brand-utils:brand')][key];
    expect(isBrand(key, branded)).toBe(false);
  });

  it("assertBrand does not throw for branded value", () => {
    expect(() => assertBrand(key, branded)).not.toThrow();
  });

  it("assertBrand throws for unbranded value", () => {
    expect(() => assertBrand(key, 123)).toThrow(TypeError);
  });

  it("assertBrand throws for null and undefined", () => {
    expect(() => assertBrand(key, null)).toThrow(TypeError);
    expect(() => assertBrand(key, undefined)).toThrow(TypeError);
  });

  it("assertBrand throws for branded wrapper with wrong key", () => {
    const otherKey = "OtherUserId" as const;
    const brandedOther = brand(otherKey, raw);
    expect(() => assertBrand(key, brandedOther)).toThrow(TypeError);
  });

  it("assertBrand throws for a plain object without brand marker", () => {
    expect(() => assertBrand(key, { value: raw })).toThrow(TypeError);
  });

  it("assertBrand throws for a branded wrapper with a different key (object)", () => {
    const otherKey = "OtherUserId" as const;
    const brandedOther = brand(otherKey, { foo: 1 });
    expect(() => assertBrand(key, brandedOther)).toThrow(TypeError);
  });

  it("assertBrand throws for a branded primitive wrapper with a different key", () => {
    const otherKey = "OtherUserId" as const;
    const brandedOther = brand(otherKey, 42);
    expect(() => assertBrand(key, brandedOther)).toThrow(TypeError);
  });

  it("assertBrand throws for a branded primitive wrapper with a missing key", () => {
    const branded = brand(key, 99);
    delete (branded as any)[Symbol.for('vs-brand-utils:brand')][key];
    expect(() => assertBrand(key, branded)).toThrow(TypeError);
  });

  it("unbrand returns the underlying value", () => {
    expect(unbrand(key, branded)).toBe(raw);
  });

  it("unbrand returns value as-is for non-object, non-branded values", () => {
    expect(unbrand(key, 123 as any)).toBe(123);
    expect(unbrand(key, undefined as any)).toBe(undefined);
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

  it("createBrand.unbrandMany returns unbranded values for array", () => {
    const UserIdBrand = createBrand<typeof key, string>(key);
    const b = UserIdBrand.brand(raw);
    expect(UserIdBrand.unbrandMany([b, b])).toEqual([raw, raw]);
  });

  it("createBrand.unbrandMany works with empty array", () => {
    const UserIdBrand = createBrand<typeof key, string>(key);
    expect(UserIdBrand.unbrandMany([])).toEqual([]);
  });

  it("createBrand.unbrandMany returns [] for empty input", () => {
    const UserIdBrand = createBrand<typeof key, string>(key);
    expect(UserIdBrand.unbrandMany([])).toEqual([]);
  });

  it("createBrand.unbrandMany returns [] for empty input (object)", () => {
    const OtherIdBrand = createBrand("OtherUserId");
    expect(OtherIdBrand.unbrandMany([])).toEqual([]);
  });

  it("createBrand.unbrandMany returns [] for empty input (primitive)", () => {
    const OtherIdBrand = createBrand("OtherUserId");
    expect(OtherIdBrand.unbrandMany([])).toEqual([]);
  });

  it("createBrand.unbrandMany returns [] for empty input (mixed types)", () => {
    const MixedBrand = createBrand("MixedKey");
    expect(MixedBrand.unbrandMany([])).toEqual([]);
  });
});
