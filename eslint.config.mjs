import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import unicorn from "eslint-plugin-unicorn";
import stylistic from "@stylistic/eslint-plugin";
import nextConfig from "eslint-config-next/core-web-vitals";

export default defineConfig([
  { ignores: ["tailwind.config.ts", "misc-scripts/rendererIsometric.js"] },
  ...nextConfig,
  ...typescriptEslint.configs["flat/recommended"],
  {
    plugins: {
      jsdoc,
      unicorn,
      "@stylistic": stylistic,
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },

    rules: {
      "semi-style": ["error", "last"],
      semi: ["error", "always"],

      "no-multiple-empty-lines": ["error", {
        max: 1,
        maxEOF: 1,
      }],

      curly: ["error", "all"],

      "brace-style": ["error", "1tbs", {
        allowSingleLine: false,
      }],

      quotes: ["error", "double"],
      "no-trailing-spaces": "error",
      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
      }],

      "@stylistic/object-curly-spacing": ["error", "always", {
        emptyObjects: "never",
      }],

      "@stylistic/indent": ["error", 2, {
        ignoredNodes: ["TemplateLiteral"],
      }],

      "@stylistic/type-annotation-spacing": ["error", {
        before: true,
        after: true,

        overrides: {
          colon: {
            before: false,
            after: true,
          },
        },
      }],

      "@stylistic/arrow-spacing": ["error", {
        before: true,
        after: true,
      }],

      "react-hooks/exhaustive-deps": "error",

      "jsdoc/require-jsdoc": ["error", {
        publicOnly: true,

        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
        },
      }],

      "unicorn/filename-case": ["error", {
        case: "kebabCase",
      }],

      "import/extensions": ["error", "ignorePackages", {
        ts: "never",
        tsx: "never",
        js: "never",
        jsx: "never",
      }],
    },
  },
]);