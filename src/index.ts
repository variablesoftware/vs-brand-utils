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

export * from './core';
export * from './brand';
export * from './typeguards';
export * from './assert';
export * from './unbrand';
export * from './factory';
