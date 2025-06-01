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

export * from '@variablesoftware/vs-brand-utils/core';
export * from '@variablesoftware/vs-brand-utils/brand';
export * from '@variablesoftware/vs-brand-utils/typeguards';
export * from '@variablesoftware/vs-brand-utils/assert';
export * from '@variablesoftware/vs-brand-utils/unbrand';
export * from '@variablesoftware/vs-brand-utils/factory';
