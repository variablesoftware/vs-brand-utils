import { describe, it, expect } from "vitest";
import { brand, isBrand, assertBrand, createBrand } from "../../src/index";

describe("vs-brand-utils: edge case coverage", () => {
  const key = "EdgeKey" as const;

  it("isBrand returns false for a branded primitive wrapper with a missing key", () => {
    const branded = brand(key, 99);
    delete (branded as any)[Symbol.for('vs-brand-utils:brand')][key];
    expect(isBrand(key, branded)).toBe(false);
  });

  it("assertBrand throws for a branded primitive wrapper with a missing key", () => {
    const branded = brand(key, 99);
    delete (branded as any)[Symbol.for('vs-brand-utils:brand')][key];
    expect(() => assertBrand(key, branded)).toThrow(TypeError);
  });

  it("createBrand.unbrandMany returns [] for empty input (mixed types)", () => {
    const MixedBrand = createBrand(key);
    expect(MixedBrand.unbrandMany([])).toEqual([]);
  });
});
