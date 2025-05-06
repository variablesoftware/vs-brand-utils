# API Reference: vs-brand-utils 🏷️🧩🛡️

This document summarizes all exports from `@variablesoftware/vs-brand-utils` with TSDoc-style explanations.

---

## Types

### `Brand<K extends string, T>`

Opaque (nominal) type. Tags `T` with phantom key `K` so it won’t mix with plain `T`.

```ts
type UserId = Brand<"UserId", string>;
```

---

## Functions

### `brand<K extends string, T>(value: T): Brand<K, T>`

Casts a value to a branded type. No runtime checks.

### `isBrand<K extends string, T>(key: K, value: unknown): value is Brand<K, T>`

Type guard for branded values. Returns true if value is of type `T`.

### `assertBrand<K extends string, T>(key: K, value: unknown): asserts value is Brand<K, T>`

Throws if value is not a branded value.

### `unbrand<K extends string, T>(value: Brand<K, T>): T`

Removes the brand at runtime (identity cast).

---

## Array Helpers

### `brandArray<K extends string, T>(key: K, values: T[]): Brand<K, T>[]`

Brands an array of values.

### `unbrandArray<K extends string, T>(branded: Brand<K, T>[]): T[]`

Removes the brand from an array of branded values.

### `brandMany<K extends string, T>(key: K, ...values: T[]): Brand<K, T>[]`

Brands multiple values (varargs).

---

## Brand Factory

### `createBrand<K extends string, T>(key: K)`

Returns an object bundling helpers for a specific brand key:

- `brand(value: T): Brand<K, T>`
- `brandMany(...values: T[]): Brand<K, T>[]`
- `is(value: unknown): value is Brand<K, T>`
- `isMany(values: unknown[]): boolean`
- `assert(value: unknown): asserts value is Brand<K, T>`
- `assertMany(values: unknown[]): void`
- `unbrand(value: Brand<K, T>): T`
- `unbrandMany(values: Brand<K, T>[]): T[]`

---

## Example

```ts
import {
  Brand,
  brand,
  isBrand,
  assertBrand,
  unbrand,
  createBrand,
} from "@variablesoftware/vs-brand-utils";

type UserId = Brand<"UserId", string>;
const id = brand<"UserId", string>("abc123");
assertBrand<"UserId", string>("UserId", id);
const raw = unbrand<"UserId", string>(id);
```

---

For more, see [Usage Guide](./usage.md).
