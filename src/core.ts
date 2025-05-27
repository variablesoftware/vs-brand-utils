// src/core.ts
/**
 * Core types and internal symbols for vs-brand-utils.
 */

export const BRAND_MARKER = Symbol.for('vs-brand-utils:brand');

export type Brand<K extends string, T> = T & { readonly __brand: K };

export interface BrandedPrimitive<K extends string, T> {
  value: T;
  [BRAND_MARKER]: Record<K, true>;
}

export interface BrandableObject {
  [BRAND_MARKER]?: Record<string, boolean>;
  [key: string]: unknown;
}

export function isPrimitive(value: unknown): value is string | number | boolean | symbol | bigint {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  );
}
