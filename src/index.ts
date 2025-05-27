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

// Internal symbol for runtime brand marking
const BRAND_MARKER = Symbol.for('vs-brand-utils:brand');
// Use a Map for primitive branding: value -> Set of brand keys
const primitiveBrandMap = new Map<string | number | symbol | boolean | bigint, Set<string>>();

/**
 * Opaque “brand” type: tags T with phantom K so it won’t mix with plain T.
 *
 * @typeParam K - Unique string key for the brand
 * @typeParam T - Underlying type
 * @example
 *   type TenantId = Brand<'TenantId', string>;
 */
export type Brand<K extends string, T> = T & { readonly __brand: K };

function isPrimitive(value: unknown): value is string | number | boolean | symbol | bigint {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  );
}

// Internal wrapper for branded primitives
interface BrandedPrimitive<K extends string, T> {
  value: T;
  [BRAND_MARKER]: { [key in K]: true };
}

/**
 * Cast a raw value into a Brand. No runtime checks are performed.
 *
 * @param key - The brand key
 * @param value - The value to brand
 * @returns The branded value
 * @example
 *   const tid = brand<'TenantId', string>('TenantId', 'abc123');
 */
export function brand<K extends string, T>(key: K, value: T): Brand<K, T> {
  if (isPrimitive(value)) {
    // Wrap primitive in an object with brand marker
    const wrapper: BrandedPrimitive<K, T> = {
      value,
      [BRAND_MARKER]: { [key]: true } as any,
    };
    return wrapper as unknown as Brand<K, T>;
  }
  if (typeof value === 'object' && value !== null) {
    (value as any)[BRAND_MARKER] = (value as any)[BRAND_MARKER] || {};
    (value as any)[BRAND_MARKER][key] = true;
    return value as Brand<K, T>;
  }
  return value as unknown as Brand<K, T>;
}

/**
 * Type-guard for a Brand. Compile-time only.
 * Returns true if `value` is of the underlying type `T`.
 *
 * @param key - The brand key
 * @param value - The value to check
 * @returns True if value is of type T
 */
export function isBrand<K extends string, T>(
  key: K,
  value: unknown,
): value is Brand<K, T> {
  if (isPrimitive(value)) {
    // Only branded wrappers are considered branded
    return (
      typeof value === 'object' &&
      value !== null &&
      BRAND_MARKER in value &&
      Boolean((value as any)[BRAND_MARKER][key])
    );
  }
  if (typeof value === 'object' && value !== null && BRAND_MARKER in value) {
    return Boolean((value as any)[BRAND_MARKER][key]);
  }
  return false;
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
 * @param key - The brand key
 * @param value - The branded value
 * @returns The underlying value
 */
export function unbrand<K extends string, T>(key: K, value: Brand<K, T>): T {
  if (typeof value === 'object' && value !== null && BRAND_MARKER in value) {
    if ('value' in value) {
      // Unwrap primitive
      return (value as any).value as T;
    }
    delete (value as any)[BRAND_MARKER][key];
    return value as unknown as T;
  }
  return value as unknown as T;
}

/**
 * Remove brand from an array of branded values.
 *
 * @param key - The brand key
 * @param branded - Array of branded values
 * @returns Array of underlying values
 */
export function unbrandArray<K extends string, T>(key: K, branded: Brand<K, T>[]): T[] {
  return branded.map((v) => unbrand(key, v));
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
  return values.map((v) => brand(key, v));
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
  return values.map((v) => brand(key, v));
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
    brand: (value: T) => brand(key, value),
    brandMany: (...values: T[]) => values.map((v) => brand(key, v)),
    is: (value: unknown) => isBrand(key, value),
    isMany: (values: unknown[]) => {
      if (values.length === 0) return false;
      // If any value is not branded, return false
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
    unbrandMany: (values: Brand<K, T>[]) => values.map((v) => unbrand(key, v)),
  };
}
