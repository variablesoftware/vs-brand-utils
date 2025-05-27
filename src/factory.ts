// src/factory.ts
import { Brand } from './core';
import { brand, brandMany } from './brand';
import { isBrand } from './typeguards';
import { assertBrand } from './assert';
import { unbrand, unbrandArray } from './unbrand';

/**
 * Factory for a specific brand key, bundling helpers together.
 */
export function createBrand<K extends string, T>(key: K) {
  return {
    brand: (value: T) => brand(key, value),
    brandMany: (...values: T[]) => brandMany(key, ...values),
    is: (value: unknown) => isBrand(key, value),
    isMany: (values: unknown[]) => {
      if (values.length === 0) return false;
      for (const v of values) {
        if (!isBrand(key, v)) return false;
      }
      return true;
    },
    assert: (value: unknown) => assertBrand(key, value),
    assertMany: (values: unknown[]) => {
      if (values.length === 0) throw new TypeError('No values provided to assertMany');
      for (const v of values) {
        if (!isBrand(key, v)) throw new TypeError(`Value is not a branded<${key}>`);
      }
    },
    unbrand: (value: Brand<K, T>) => unbrand(key, value),
    unbrandMany: (values: Brand<K, T>[]) => unbrandArray(key, values),
  };
}
