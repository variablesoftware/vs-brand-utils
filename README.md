# @variablesoftware/vs-brand-utils 🏷️🧩🛡️

[![Test Suite](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/variablesoftware/vs-brand-utils/actions)
[![NPM version](https://img.shields.io/npm/v/@variablesoftware/vs-brand-utils?style=flat-square)](https://www.npmjs.com/package/@variablesoftware/vs-brand-utils)
[![License](https://img.shields.io/github/license/variablesoftware/vs-brand-utils?style=flat-square)](https://github.com/variablesoftware/vs-brand-utils/blob/main/LICENSE.txt)
[![Coverage](https://img.shields.io/coveralls/github/variablesoftware/vs-brand-utils/main)](https://coveralls.io/github/variablesoftware/vs-brand-utils)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@variablesoftware/vs-brand-utils)](https://bundlephobia.com/package/@variablesoftware/vs-brand-utils)
[![Downloads](https://img.shields.io/npm/dm/@variablesoftware/vs-brand-utils)](https://www.npmjs.com/package/@variablesoftware/vs-brand-utils)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/variablesoftware/vs-brand-utils/pulls)

**Nominal (branded) TypeScript types & helpers for safe opaque types.**

🏷️🧩🛡️ Type-safe branding for primitives and objects in TypeScript.

---

# Usage Guide

See the [Usage Guide](./docs/usage.md) for practical examples and patterns.

# API Reference

See the [API Reference](./docs/api.md) for a summary of all exports and detailed documentation.

---

## 🔧 Installation

```bash
yarn add @variablesoftware/vs-brand-utils
```

---

## 🚀 Usage

```ts
import {
  Brand,
  brand,
  isBrand,
  assertBrand,
  unbrand,
  createBrand,
  brandArray,
  unbrandArray,
  brandMany
} from "@variablesoftware/vs-brand-utils";

// Define a branded type
export type UserId = Brand<"UserId", string>;

// Brand a value
const id = brand<"UserId", string>("UserId", "abc123");

// Type-safe: cannot assign UserId to string or vice versa
// const s: string = id; // Type error
// const id2: UserId = 'plainstring'; // Type error

// Type guard
if (isBrand("UserId", id)) {
  // id is UserId here
}

// Assert
assertBrand("UserId", id);

// Unbrand
const raw: string = unbrand("UserId", id);

// Brand an array
const brandedArr = brandArray("UserId", ["a", "b"]);

// Unbrand an array
const arr: string[] = unbrandArray("UserId", brandedArr);

// Brand many values
const many = brandMany("UserId", "a", "b");

// Factory for a specific brand
const TenantId = createBrand<"TenantId", string>("TenantId");
const tid = TenantId.brand("t-123");
```

---

## ✨ Features

- 🏷️ Nominal/opaque types for primitives and objects
- 🧩 Type-safe branding and unbranding helpers
- 🛡️ Compile-time enforcement: prevents accidental mixing of branded and unbranded types
- Array helpers for batch branding/unbranding
- Factory for reusable brand helpers
- Zero runtime cost: all checks are type-level
- **100% test and code coverage** (see `tests/unit/` for split test suites)
- Edge-case and runtime safety for all helpers

---

## 🎯 Goals

- Prevent accidental mixing of IDs, tokens, and other primitives
- Enable safe domain modeling with TypeScript
- No runtime overhead or dependencies
- Simple, composable API
- Fully documented and tested

---

## 🧪 Test Coverage

Tested using `vitest` with coverage for:

- Branding and unbranding
- Type guards and assertions
- Compile-time type errors
- Array helpers
- Edge cases and runtime behaviors

Test suites are organized by concern:
- `runtime-branding.test.ts`
- `compile-type-errors.test.ts`
- `helpers-and-factory.test.ts`
- `edge-cases.test.ts`
- `missing-marker-edge-cases.test.ts`

Run tests:

```bash
yarn test
```

---

## 📦 Modular Structure (vNext)

As of May 2025, the codebase is split into focused modules for maintainability and tree-shaking:

- `core` – core types and internal symbols
- `brand` – branding helpers (`brand`, `brandArray`, `brandMany`)
- `typeguards` – type guard helpers (`isBrand`)
- `assert` – assertion helpers (`assertBrand`)
- `unbrand` – unbranding helpers (`unbrand`, `unbrandArray`)
- `factory` – the `createBrand` factory for a bundled API

You can import everything from the main entry point:

```ts
import { brand, isBrand, assertBrand, unbrand, createBrand } from "@variablesoftware/vs-brand-utils";
```

Or, for advanced usage and smaller bundles, import only what you need:

```ts
import { brand } from "@variablesoftware/vs-brand-utils/brand";
import { isBrand } from "@variablesoftware/vs-brand-utils/typeguards";
```

All helpers are still available via the main package import for convenience.

---

## 🧪 Test Coverage & Code Structure

- All helpers and edge cases are tested for 100% coverage.
- See `src/` for the modular implementation.
- See `tests/unit/` for split test suites by concern.

---

## 🚧 Status

**This package is under active development and not yet stable.**

Once stable, it will be published as:

```json
"@variablesoftware/vs-brand-utils": "^0.8.0"
```

---

## 📄 License

MIT © Rob Friedman / Variable Software

---

> Built with ❤️ by [@variablesoftware](https://github.com/variablesoftware)  
> Thank you for downloading and using this project. Pull requests are warmly welcomed!

---

## 🌐 Inclusive & Accessible Design

- Naming, logging, error messages, and tests avoid cultural or ableist bias
- Avoids assumptions about input/output formats or encodings
- Designed for clarity, predictability, and parity with TypeScript best practices
- Works well in diverse, multilingual, and inclusive developer environments

---
