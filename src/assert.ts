// src/assert.ts
import { Brand } from './core';
import { isBrand } from './typeguards';

/**
 * Assert-style guard: throws if not a branded value.
 */
export function assertBrand<K extends string, T>(
  key: K,
  value: unknown,
): asserts value is Brand<K, T> {
  if (!isBrand(key, value)) {
    throw new TypeError(`Value is not a branded<${key}>`);
  }
}
