/**
 * @location src/index.ts
 * @license MIT
 * @packageDocumentation
 * @module vs-brand-utils
 *
 * Nominal (branded) TypeScript types & helpers for safe opaque types.
 *
 * @remarks
 * - Use `Brand<K, T>` to create opaque types that are not assignable to their base type.
 * - Use `brand`, `isBrand`, `assertBrand`, `unbrand`, and helpers for safe usage.
 * - See README and usage docs for examples.
 */

/**
 * Opaque “brand” type: tags T with phantom K so it won’t mix with plain T.
 *
 * @typeParam K - Unique string key for the brand
 * @typeParam T - Underlying type
 * @example
 *   type TenantId = Brand<'TenantId', string>;
 */
export type Brand<K extends string, T> = T & { readonly __brand: K };

/**
 * Cast a raw value into a Brand. No runtime checks are performed.
 *
 * @param value - The value to brand
 * @returns The branded value
 * @example
 *   const tid = brand<'TenantId', string>('abc123');
 */
export function brand<K extends string, T>(value: T): Brand<K, T> {
  return value as Brand<K, T>;
}

/**
 * Type-guard for a Brand. Compile-time only.
 * Returns true if `value` is of the underlying type `T`.
 *
 * @param _key - The brand key (unused at runtime)
 * @param value - The value to check
 * @returns True if value is of type T
 */
export function isBrand<K extends string, T>(
  _key: K,
  value: unknown,
): value is Brand<K, T> {
  return typeof value === typeof (null as unknown as T);
}

/**
 * Assert-style guard: throws if not a branded value.
 *
 * @param key - The brand key
 * @param value - The value to check
 * @throws {TypeError} If value is not a branded value
 */
export function assertBrand<K extends string, T>(
  key: K,
  value: unknown,
): asserts value is Brand<K, T> {
  if (!isBrand(key, value)) {
    throw new TypeError(`Value is not a branded<${key}>`);
  }
}

/**
 * Strip the brand away at runtime. (Identity cast.)
 *
 * @param value - The branded value
 * @returns The underlying value
 */
export function unbrand<K extends string, T>(value: Brand<K, T>): T {
  return value as unknown as T;
}

/**
 * Remove brand from an array of branded values.
 *
 * @param branded - Array of branded values
 * @returns Array of underlying values
 */
export function unbrandArray<K extends string, T>(branded: Brand<K, T>[]): T[] {
  return branded.map((b) => b as unknown as T);
}

/**
 * Brand an array of values.
 *
 * @param key - The brand key
 * @param values - Array of values to brand
 * @returns Array of branded values
 */
export function brandArray<K extends string, T>(
  key: K,
  values: T[],
): Brand<K, T>[] {
  return values.map((v) => brand<K, T>(v));
}

/**
 * Brand multiple values (varargs).
 *
 * @param key - The brand key
 * @param values - Values to brand
 * @returns Array of branded values
 */
export function brandMany<K extends string, T>(
  key: K,
  ...values: T[]
): Brand<K, T>[] {
  return values.map((v) => brand<K, T>(v));
}

/**
 * Factory for a specific brand key, bundling helpers together.
 *
 * @param key - The brand key
 * @returns An object with helpers for the brand
 * @example
 *   const TenantId = createBrand<'TenantId', string>('TenantId');
 *   type TenantId = ReturnType<typeof TenantId.brand>;
 *   TenantId.is(someValue); // type-guard
 *   TenantId.assert(someValue); // throws if bad
 *   const tid = TenantId.brand('abc123');
 */
export function createBrand<K extends string, T>(key: K) {
  return {
    brand: (value: T) => brand<K, T>(value),
    brandMany: (...values: T[]) => values.map((v) => brand<K, T>(v)),
    is: (value: unknown) => isBrand<K, T>(key, value),
    isMany: (values: unknown[]) => values.every((v) => isBrand<K, T>(key, v)),
    assert: (value: unknown) => assertBrand<K, T>(key, value),
    assertMany: (values: unknown[]) => {
      for (const v of values) assertBrand<K, T>(key, v);
    },
    unbrand: (value: Brand<K, T>) => value as unknown as T,
    unbrandMany: (values: Brand<K, T>[]) =>
      values.map((v) => v as unknown as T),
  };
}
