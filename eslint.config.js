import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier/flat";

export default [
  {
    ignores: ["**/tests/**","**/dist/**", "**/.pnp.*"],
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        console: true,
        process: true,
        AbortSignal: "readonly",
        DOMException: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly"
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
  },
  js.configs.recommended,
  {
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  prettier,
];
