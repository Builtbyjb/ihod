import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist", "routeTree.gen.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
    },
    rules: {
      "react-refresh/only-export-components": [
        "off",
        { allowExportNames: ["Route"] },
      ],
      "react-hooks/set-state-in-effect": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "no-warning-comments": [
        "warn",
        {
          terms: ["todo", "fixme"],
          location: "start",
        },
      ],
    },
  },
];
