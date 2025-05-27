// src/brand.ts
import { BRAND_MARKER, Brand, BrandedPrimitive, BrandableObject, isPrimitive } from './core';

/**
 * Cast a raw value into a Brand. No runtime checks are performed.
 */
export function brand<K extends string, T>(key: K, value: T): Brand<K, T> {
  if (isPrimitive(value)) {
    const wrapper: BrandedPrimitive<K, T> = {
      value,
      [BRAND_MARKER]: { [key]: true } as Record<K, true>,
    };
    return wrapper as unknown as Brand<K, T>;
  }
  if (typeof value === 'object' && value !== null) {
    const obj = value as BrandableObject;
    obj[BRAND_MARKER] = obj[BRAND_MARKER] || {};
    obj[BRAND_MARKER]![key] = true;
    return obj as Brand<K, T>;
  }
  return value as unknown as Brand<K, T>;
}

/**
 * Brand an array of values.
 */
export function brandArray<K extends string, T>(key: K, values: T[]): Brand<K, T>[] {
  return values.map((v) => brand(key, v));
}

/**
 * Brand multiple values (varargs).
 */
export function brandMany<K extends string, T>(key: K, ...values: T[]): Brand<K, T>[] {
  return values.map((v) => brand(key, v));
}
