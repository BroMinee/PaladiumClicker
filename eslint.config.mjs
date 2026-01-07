import { defineConfig } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import unicorn from "eslint-plugin-unicorn";
import _import from "eslint-plugin-import";
import stylistic from "@stylistic/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: fixupConfigRules(compat.extends(
        "next/core-web-vitals",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
    )),

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        jsdoc,
        unicorn,
        import: fixupPluginRules(_import),
        "@stylistic": stylistic,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
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
            before: false,
            after: true,

            overrides: {
                colon: {
                    before: false,
                    after: true,
                },

                arrow: {
                    before: true,
                    after: true,
                },
            },
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
}]);