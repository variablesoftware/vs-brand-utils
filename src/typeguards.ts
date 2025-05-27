// src/typeguards.ts
import { Brand } from './core';
import { BRAND_MARKER, BrandableObject, isPrimitive } from './core';

/**
 * Type-guard for a Brand. Compile-time only.
 * Returns true if `value` is of the underlying type `T`.
 */
export function isBrand<K extends string, T>(
  key: K,
  value: unknown,
): value is Brand<K, T> {
  // v8 coverage: unreachable for primitives, but required for type safety (primitives are never objects)
  if (isPrimitive(value)) {
    return (
      typeof value === 'object' &&
      value !== null &&
      BRAND_MARKER in value &&
      Boolean((value as BrandableObject)[BRAND_MARKER]?.[key])
    );
  }
  if (typeof value === 'object' && value !== null && BRAND_MARKER in value) {
    return Boolean((value as BrandableObject)[BRAND_MARKER]?.[key]);
  }
  return false;
}
