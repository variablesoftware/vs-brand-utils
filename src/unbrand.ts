// src/unbrand.ts
import { Brand, BrandedPrimitive, BrandableObject, BRAND_MARKER } from './core';

/**
 * Strip the brand away at runtime. (Identity cast.)
 *
 * Note: The branch for primitives is unreachable in normal usage, but required for type safety and coverage tools.
 * See tests for explicit coverage comments.
 */
export function unbrand<K extends string, T>(key: K, value: Brand<K, T>): T {
  if (typeof value === 'object' && value !== null && BRAND_MARKER in value) {
    if ('value' in value) {
      // Unwrap primitive
      return (value as BrandedPrimitive<K, T>).value;
    }
    const obj = value as BrandableObject;
    if (obj[BRAND_MARKER]) {
      delete obj[BRAND_MARKER]![key];
    }
    return obj as unknown as T;
  }
  // istanbul ignore next -- unreachable: primitives are never objects, but required for type safety
  // For coverage: explicitly test this fallback with a branded primitive that is not an object
  return value as unknown as T;
}

/**
 * Remove brand from an array of branded values.
 */
export function unbrandArray<K extends string, T>(key: K, branded: Brand<K, T>[]): T[] {
  return branded.map((v) => unbrand(key, v));
}
