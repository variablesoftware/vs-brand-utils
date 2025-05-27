import { describe, it, expect } from "vitest";
import { brand, isBrand, assertBrand, createBrand } from "../../src/index";

describe("vs-brand-utils: explicit missing brand marker edge cases", () => {
  const key = "EdgeKey2" as const;

  it("isBrand returns false for branded primitive wrapper with missing marker property", () => {
    const branded = brand(key, 123);
    // Remove the brand marker property entirely
    delete (branded as any)[Symbol.for('vs-brand-utils:brand')];
    expect(isBrand(key, branded)).toBe(false);
  });

  it("assertBrand throws for branded primitive wrapper with missing marker property", () => {
    const branded = brand(key, 123);
    delete (branded as any)[Symbol.for('vs-brand-utils:brand')];
    expect(() => assertBrand(key, branded)).toThrow(TypeError);
  });

  it("createBrand.unbrandMany returns [] for empty input (primitive/object mix)", () => {
    const MixedBrand = createBrand(key);
    expect(MixedBrand.unbrandMany([])).toEqual([]);
  });
});
