# Usage Guide for vs-brand-utils 🏷️🧩🛡️

This guide provides practical examples and patterns for using branded types in TypeScript with `@variablesoftware/vs-brand-utils`.

---

## Basic Branding

```ts
import { Brand, brand } from "@variablesoftware/vs-brand-utils";

type UserId = Brand<"UserId", string>;
const id = brand<"UserId", string>("abc123");
```

- `id` is now a `UserId` and cannot be assigned to a plain `string`.

---

## Type Guards and Assertions

```ts
import { isBrand, assertBrand } from "@variablesoftware/vs-brand-utils";

if (isBrand<"UserId", string>("UserId", id)) {
  // id is UserId here
}

assertBrand<"UserId", string>("UserId", id); // Throws if not branded
```

---

## Unbranding

```ts
import { unbrand } from "@variablesoftware/vs-brand-utils";

const raw: string = unbrand<"UserId", string>(id);
```

---

## Array Helpers

```ts
import { brandArray, unbrandArray } from "@variablesoftware/vs-brand-utils";

const ids = brandArray<"UserId", string>("UserId", ["a", "b"]);
const rawIds = unbrandArray<"UserId", string>(ids);
```

---

## Brand Factories

```ts
import { createBrand } from "@variablesoftware/vs-brand-utils";

const TenantId = createBrand<"TenantId", string>("TenantId");
const tid = TenantId.brand("t-123");
TenantId.assert(tid);
```

---

## Compile-Time Safety

```ts
// @ts-expect-error
const s: string = id;
// @ts-expect-error
const id2: UserId = "plainstring";
```

---

## Advanced: Double Branding (Not Recommended)

```ts
type A = Brand<"A", string>;
type B = Brand<"B", A>;
const a = brand<"A", string>("x");
// @ts-expect-error
const b: B = a;
```

---

For more, see [API documentation](./api.md).
